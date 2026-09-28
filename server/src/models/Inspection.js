import mongoose from 'mongoose'

const InspectionSchema = new mongoose.Schema(
  {
    inspectionCode: { type: String, required: true, unique: true }, // e.g. 'INSP-2026-902'
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    assetCode: { type: String, required: true },
    segmentCode: { type: String, required: true },
    inspectorName: { type: String, required: true },
    inspectorRole: { type: String, default: 'Deputy Executive Engineer' },
    inspectionType: {
      type: String,
      enum: ['ROUTINE_CONDITION', 'CONSTRUCTION_STAGE', 'COMPLAINT_VERIFICATION', 'DLP_WARRANTY_CHECK', 'QUALITY_AUDIT'],
      default: 'ROUTINE_CONDITION',
    },
    stageLayer: {
      type: String,
      enum: ['SUBGRADE', 'GSB_LAYER', 'WMM_BASE', 'DBM_BINDER', 'BC_WEARING_SURFACE', 'DRAIN_STRUCTURE', 'BUILDING_PLINTH', 'FINISHING'],
      default: 'BC_WEARING_SURFACE',
    },
    // Location check
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },
    distanceFromSegmentMeters: { type: Number, default: 0 },
    // Photo Evidence with AI Verification
    photos: [
      {
        url: { type: String, required: true },
        captureToken: { type: String },
        timestamp: { type: Date, default: Date.now },
        riskScore: { type: Number, default: 5 },
        isLiveCapture: { type: Boolean, default: true },
        aiConfidence: { type: Number, default: 0.98 },
        notes: { type: String },
      },
    ],
    qualityScore: { type: Number, min: 0, max: 100, default: 90 },
    remarks: { type: String },
    status: {
      type: String,
      enum: ['PASSED', 'FLAGGED_FOR_REWORK', 'PENDING_LAB_REPORT', 'AUDIT_REVIEW'],
      default: 'PASSED',
    },
  },
  { timestamps: true }
)

export const Inspection = mongoose.model('Inspection', InspectionSchema)
