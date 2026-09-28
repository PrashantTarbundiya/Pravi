import mongoose from 'mongoose'

const ComplaintSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ['POTHOLE', 'CRACKING', 'DRAINAGE_OVERFLOW', 'BRIDGE_EXPANSION_JOINT', 'ROAD_CAVING', 'BUILDING_CRACK', 'OTHER'],
      default: 'POTHOLE',
      index: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'HIGH',
      index: true,
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'PENDING_AI_VERIFICATION', 'FLAGGED_SUSPICIOUS', 'ASSIGNED_TO_CONTRACTOR', 'WORK_IN_PROGRESS', 'REPAIRED_AWAITING_INSPECTION', 'RESOLVED', 'REJECTED'],
      default: 'SUBMITTED',
      index: true,
    },
    location: {
      address: { type: String, required: true },
      assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', index: true },
      assetCode: { type: String },
      segmentCode: { type: String },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    reportedBy: {
      name: { type: String, default: 'Citizen' },
      phone: { type: String },
      isAnonymous: { type: Boolean, default: false },
    },
    evidence: {
      // Pure DB Storage (data URI or /api/verification/images/:id)
      imageUrl: { type: String, required: true },
      thumbnailUrl: { type: String },
      dbImageId: { type: mongoose.Schema.Types.ObjectId, ref: 'ImageStore' },
      captureToken: { type: String },
      source: {
        type: String,
        enum: ['LIVE_CAMERA', 'DEVICE_GALLERY', 'SYSTEM_SEED'],
        default: 'LIVE_CAMERA',
      },
      isLiveCapture: { type: Boolean, default: true },
      gpsDistanceMeters: { type: Number, default: 4.2 },
      isWithinGeofence: { type: Boolean, default: true },
      exifAnalysis: {
        deviceModel: { type: String, default: 'Android Mobile Sensor' },
        software: { type: String, default: 'InfraManage Live Cam' },
        hasEditingArtifacts: { type: Boolean, default: false },
        tamperProbability: { type: Number, default: 0.05 },
      },
      aiClassification: {
        predictedDefect: { type: String, default: 'POTHOLE' },
        confidence: { type: Number, default: 0.94 },
        surfaceIntegrityRisk: { type: Number, default: 82 },
        model: { type: String, default: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free' },
        reasoning: { type: String },
        reasoningTokens: { type: Number, default: 140 },
        standardRepairMethod: { type: String },
      },
      overallRiskScore: { type: Number, min: 0, max: 100, default: 12, index: true },
      verifiedByAuditor: { type: Boolean, default: false },
      auditorNotes: { type: String },
    },
    resolution: {
      repairedAt: { type: Date },
      repairedByContractor: { type: String },
      afterImageUrl: { type: String },
      afterVerificationRiskScore: { type: Number },
      inspectorSignOff: { type: Boolean, default: false },
    },
    slaDeadline: { type: Date, index: true },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
)

// Scalability Compound Indexes
ComplaintSchema.index({ status: 1, createdAt: -1 })
ComplaintSchema.index({ category: 1, createdAt: -1 })
ComplaintSchema.index({ 'evidence.overallRiskScore': -1, createdAt: -1 })

export const Complaint = mongoose.model('Complaint', ComplaintSchema)
