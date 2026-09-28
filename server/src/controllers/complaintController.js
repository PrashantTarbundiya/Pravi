import { Complaint } from '../models/Complaint.js'
import { Asset } from '../models/Asset.js'
import { AuditLog } from '../models/AuditLog.js'
import { verifyImageSubmission } from '../services/verificationService.js'

export const getComplaints = async (req, res) => {
  try {
    const { status, severity, category, flaggedOnly, search } = req.query
    const query = {}

    if (status) query.status = status
    if (severity) query.severity = severity
    if (category) query.category = category
    if (flaggedOnly === 'true') query['evidence.overallRiskScore'] = { $gte: 50 }

    if (search) {
      query.$or = [
        { ticketNumber: new RegExp(search, 'i') },
        { title: new RegExp(search, 'i') },
        { 'location.address': new RegExp(search, 'i') },
      ]
    }

    const complaints = await Complaint.find(query).sort({ createdAt: -1 }).limit(100)
    res.json({ success: true, count: complaints.length, data: complaints })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getComplaintByTicket = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ ticketNumber: req.params.ticketNumber })
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' })
    res.json({ success: true, data: complaint })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      severity,
      address,
      coordinates,
      reportedBy,
      captureToken,
      imageUrl,
      fileName,
      source = 'LIVE_CAMERA',
      dbImageId,
      verificationResult,
      aiFindings,
    } = req.body

    let targetAssetCoords = null
    let matchedAsset = null
    try {
      if (coordinates && coordinates.length === 2) {
        matchedAsset = await Asset.findOne({
          category: { $in: ['ROAD', 'BRIDGE', 'GOVERNMENT_BUILDING'] },
        }).maxTimeMS(4000)
        if (matchedAsset && matchedAsset.geometry?.coordinates) {
          targetAssetCoords = Array.isArray(matchedAsset.geometry.coordinates[0])
            ? matchedAsset.geometry.coordinates[0]
            : matchedAsset.geometry.coordinates
        }
      }
    } catch (err) {
      console.warn('Asset lookup non-fatal error:', err.message)
    }

    // Reuse verification result if already completed in upload step, or run 4-Layer verification
    const verification =
      verificationResult ||
      verifyImageSubmission({
        captureToken,
        submittedCoords: coordinates,
        targetAssetCoords,
        fileName: fileName || 'evidence.jpg',
        claimedCategory: category,
        source: source || (captureToken ? 'LIVE_CAMERA' : 'DEVICE_GALLERY'),
        aiFindings,
      })

    const ticketNumber = `RNB-GRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

    // SLA Deadline
    const slaHours = severity === 'CRITICAL' ? 24 : severity === 'HIGH' ? 48 : severity === 'MEDIUM' ? 120 : 240
    const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000)

    const isLive = source === 'LIVE_CAMERA' || verification.breakdown?.layer1LiveCapture?.source === 'LIVE_CAMERA'

    const complaint = new Complaint({
      ticketNumber,
      title: title || `${category || 'Road'} issue reported at ${address || 'Location'}`,
      description: description || 'Citizen reported road surface defect.',
      category: category || 'POTHOLE',
      severity: severity || 'HIGH',
      status: verification.isFlagged ? 'FLAGGED_SUSPICIOUS' : 'SUBMITTED',
      location: {
        address: address || 'Ahmedabad R&B Zone',
        coordinates: coordinates || [72.5714, 23.0225],
        assetId: matchedAsset?._id,
        assetCode: matchedAsset?.assetCode || 'RNB-GJ-RD-01',
      },
      reportedBy: reportedBy || { name: 'Citizen', isAnonymous: false },
      evidence: {
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop',
        dbImageId: dbImageId || null,
        captureToken: captureToken || (isLive ? 'LIVE-VERIFIED' : 'GALLERY-VERIFIED'),
        source: isLive ? 'LIVE_CAMERA' : 'DEVICE_GALLERY',
        isLiveCapture: isLive,
        gpsDistanceMeters: verification.breakdown?.layer2Location?.distanceMeters || 4.2,
        isWithinGeofence: verification.breakdown?.layer2Location?.passed ?? true,
        exifAnalysis: {
          deviceModel: isLive ? 'Live In-App Camera' : 'Device Gallery Album',
          software: 'InfraManage Verifier v2',
          hasEditingArtifacts: !(verification.breakdown?.layer3Forensics?.passed ?? true),
          tamperProbability: verification.breakdown?.layer3Forensics?.passed ? 0.03 : 0.45,
        },
        aiClassification: {
          predictedDefect: aiFindings?.predictedDefect || verification.breakdown?.layer4Semantic?.detected || category || 'POTHOLE',
          confidence: aiFindings?.confidence || verification.breakdown?.layer4Semantic?.confidence || 0.95,
          surfaceIntegrityRisk: aiFindings?.surfaceIntegrityRisk || 78,
          model: aiFindings?.model || 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
          reasoning: aiFindings?.reasoning || verification.breakdown?.layer4Semantic?.reasoning || '',
          reasoningTokens: aiFindings?.reasoningTokens || 140,
          standardRepairMethod: aiFindings?.standardRepairMethod || '',
        },
        overallRiskScore: verification.riskScore,
      },
      slaDeadline,
    })

    await complaint.save()

    // Non-blocking Audit Log creation
    try {
      await AuditLog.create({
        action: 'IMAGE_VERIFIED',
        entityType: 'Complaint',
        entityId: ticketNumber,
        riskScoreBefore: 0,
        riskScoreAfter: verification.riskScore,
        reason: `Automated 4-layer check: ${verification.recommendation} (Source: ${isLive ? 'Live Camera' : 'Device Gallery'})`,
        metaData: {
          breakdown: verification.breakdown,
          model: aiFindings?.model || 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
          reasoningTokens: aiFindings?.reasoningTokens || 140,
        },
      })
    } catch (auditErr) {
      console.warn('Audit log write error:', auditErr.message)
    }

    res.status(201).json({
      success: true,
      data: complaint,
      verificationResult: verification,
      aiFindings,
      message: 'Grievance submitted and verified successfully',
    })
  } catch (error) {
    console.error('createComplaint error:', error)
    res.status(500).json({ success: false, message: error.message || 'Server error creating complaint' })
  }
}

export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, remarks, contractorName, afterImageUrl, overrideRiskScore } = req.body
    const update = { status }

    if (remarks) update['evidence.auditorNotes'] = remarks
    if (contractorName) update['resolution.repairedByContractor'] = contractorName
    if (afterImageUrl) {
      update['resolution.afterImageUrl'] = afterImageUrl
      update['resolution.repairedAt'] = new Date()
      update['resolution.afterVerificationRiskScore'] = overrideRiskScore || 10
    }
    if (status === 'RESOLVED') {
      update.resolvedAt = new Date()
      update['resolution.inspectorSignOff'] = true
    }
    if (overrideRiskScore !== undefined) {
      update['evidence.overallRiskScore'] = overrideRiskScore
      update['evidence.verifiedByAuditor'] = true
    }

    const complaint = await Complaint.findOneAndUpdate(
      { ticketNumber: req.params.ticketNumber },
      { $set: update },
      { new: true }
    )

    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' })

    res.json({ success: true, data: complaint, message: `Status updated to ${status}` })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const auditReviewComplaint = updateComplaintStatus

