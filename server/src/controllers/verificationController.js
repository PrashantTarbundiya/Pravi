import { generateCaptureToken, verifyImageSubmission } from '../services/verificationService.js'
import { analyzeInfrastructureDefectWithAI } from '../services/aiService.js'
import { Complaint } from '../models/Complaint.js'
import { AuditLog } from '../models/AuditLog.js'
import { ImageStore } from '../models/ImageStore.js'

export const requestCaptureToken = (req, res) => {
  try {
    const { coordinates } = req.body
    const tokenData = generateCaptureToken(coordinates)
    res.json({
      success: true,
      data: tokenData,
      message: 'Single-use camera capture token generated. Photo must be captured within 120 seconds.',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * Upload image and store purely in MongoDB database (no disk files).
 * Runs OpenRouter AI reasoning with nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free.
 */
export const uploadAndVerifyImage = async (req, res) => {
  try {
    if (!req.file && !req.body.imageBase64) {
      return res.status(400).json({ success: false, message: 'No image file or data uploaded' })
    }

    const {
      captureToken,
      latitude,
      longitude,
      category = 'POTHOLE',
      targetLat,
      targetLng,
      source = 'LIVE_CAMERA', // 'LIVE_CAMERA' or 'DEVICE_GALLERY'
      description = '',
      address = 'Ahmedabad R&B Corridor',
    } = req.body

    const submittedCoords = latitude && longitude ? [parseFloat(longitude), parseFloat(latitude)] : null
    const targetCoords = targetLat && targetLng ? [parseFloat(targetLng), parseFloat(targetLat)] : null

    // Determine buffer and base64 data URI
    let buffer
    let contentType = 'image/jpeg'
    let originalName = 'evidence.jpg'
    let size = 0

    if (req.file) {
      buffer = req.file.buffer
      contentType = req.file.mimetype || 'image/jpeg'
      originalName = req.file.originalname || `evidence-${Date.now()}.jpg`
      size = req.file.size
    } else if (req.body.imageBase64) {
      const match = req.body.imageBase64.match(/^data:([^;]+);base64,(.+)$/)
      if (match) {
        contentType = match[1]
        buffer = Buffer.from(match[2], 'base64')
      } else {
        buffer = Buffer.from(req.body.imageBase64, 'base64')
      }
      size = buffer.length
      originalName = `evidence-base64-${Date.now()}.jpg`
    }

    const base64DataUri = `data:${contentType};base64,${buffer.toString('base64')}`

    // 1. Store image directly into MongoDB ImageStore (Pure DB Storage)
    const storedImage = await ImageStore.create({
      filename: originalName,
      contentType,
      size,
      data: buffer,
      dataUrl: base64DataUri,
      source: source || (captureToken ? 'LIVE_CAMERA' : 'DEVICE_GALLERY'),
      metadata: {
        category,
        captureToken: captureToken || null,
        coordinates: submittedCoords,
      },
    })

    console.log(`[DB ImageStore] Image saved purely in MongoDB! Doc ID: ${storedImage._id} (${size} bytes)`)

    // 2. Run OpenRouter AI Reasoning with nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free
    const aiFindings = await analyzeInfrastructureDefectWithAI({
      category,
      description: description || `Reported ${category} defect on ${address}`,
      location: address,
      source: source || 'LIVE_CAMERA',
    })

    // 3. Run 4-layer verification engine with AI findings
    const verification = verifyImageSubmission({
      captureToken,
      submittedCoords,
      targetAssetCoords: targetCoords,
      fileName: originalName,
      claimedCategory: category,
      source: source || 'LIVE_CAMERA',
      aiFindings,
    })

    res.json({
      success: true,
      imageUrl: base64DataUri, // inline DB-stored data URL
      dbImageId: storedImage._id,
      filename: originalName,
      fileSize: size,
      source: source || (captureToken ? 'LIVE_CAMERA' : 'DEVICE_GALLERY'),
      verification,
      aiFindings,
    })
  } catch (error) {
    console.error('uploadAndVerifyImage error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * Direct image stream from MongoDB database
 */
export const getImageFromDb = async (req, res) => {
  try {
    const imageDoc = await ImageStore.findById(req.params.id)
    if (!imageDoc) {
      return res.status(404).json({ success: false, message: 'Image not found in database' })
    }

    res.setHeader('Content-Type', imageDoc.contentType || 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.send(imageDoc.data)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const verifyDirect = (req, res) => {
  try {
    const { captureToken, coordinates, targetCoords, fileName, category, source } = req.body
    const result = verifyImageSubmission({
      captureToken,
      submittedCoords: coordinates,
      targetAssetCoords: targetCoords,
      fileName,
      claimedCategory: category,
      source: source || 'LIVE_CAMERA',
    })
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getAuditQueue = async (req, res) => {
  try {
    const flagged = await Complaint.find({
      $or: [
        { status: 'FLAGGED_SUSPICIOUS' },
        { 'evidence.overallRiskScore': { $gte: 45 } },
        { 'evidence.verifiedByAuditor': false },
      ],
    })
      .sort({ 'evidence.overallRiskScore': -1, createdAt: -1 })
      .limit(50)

    const auditTrail = await AuditLog.find().sort({ createdAt: -1 }).limit(30)

    res.json({
      success: true,
      count: flagged.length,
      queue: flagged,
      recentAuditLogs: auditTrail,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
