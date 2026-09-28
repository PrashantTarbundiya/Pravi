import { Inspection } from '../models/Inspection.js'
import { Asset } from '../models/Asset.js'
import { generateCaptureToken, calculateDistanceMeters } from '../services/verificationService.js'

export const getInspections = async (req, res) => {
  try {
    const { assetCode, status, stageLayer } = req.query
    const query = {}
    if (assetCode) query.assetCode = assetCode
    if (status) query.status = status
    if (stageLayer) query.stageLayer = stageLayer

    const inspections = await Inspection.find(query).sort({ createdAt: -1 }).limit(50)
    res.json({ success: true, count: inspections.length, data: inspections })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createInspection = async (req, res) => {
  try {
    const {
      assetId,
      assetCode,
      segmentCode,
      inspectorName,
      inspectionType,
      stageLayer,
      coordinates,
      photos,
      qualityScore,
      remarks,
    } = req.body

    const inspectionCode = `INSP-RNB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`

    // Distance check from asset
    const asset = await Asset.findById(assetId)
    let dist = 5
    if (asset && asset.geometry && coordinates) {
      const assetCoord = Array.isArray(asset.geometry.coordinates[0])
        ? asset.geometry.coordinates[0]
        : asset.geometry.coordinates
      dist = calculateDistanceMeters(coordinates, assetCoord)
    }

    const inspection = new Inspection({
      inspectionCode,
      assetId: assetId || asset?._id,
      assetCode: assetCode || asset?.assetCode || 'RNB-RD-01',
      segmentCode: segmentCode || 'SEG-001',
      inspectorName: inspectorName || 'Field Engineer',
      inspectionType: inspectionType || 'ROUTINE_CONDITION',
      stageLayer: stageLayer || 'BC_WEARING_SURFACE',
      coordinates: coordinates || [72.5714, 23.0225],
      distanceFromSegmentMeters: dist,
      photos: photos || [
        {
          url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=600&auto=format&fit=crop',
          riskScore: dist > 100 ? 45 : 8,
          isLiveCapture: true,
          aiConfidence: 0.96,
        },
      ],
      qualityScore: qualityScore || 88,
      remarks: remarks || 'R&B technical specifications (IRC:37) met.',
      status: qualityScore < 60 ? 'FLAGGED_FOR_REWORK' : 'PASSED',
    })

    await inspection.save()

    // Update asset last inspection date
    if (asset) {
      asset.lastInspectionDate = new Date()
      await asset.save()
    }

    res.status(201).json({ success: true, data: inspection })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}
