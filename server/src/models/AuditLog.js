import mongoose from 'mongoose'

const AuditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ['IMAGE_VERIFIED', 'AUDITOR_OVERRIDE', 'COMPLAINT_ASSIGNED', 'DLP_PENALTY_LEVIED', 'INSPECTION_REJECTED', 'PAYMENT_APPROVED'],
    },
    entityType: { type: String, required: true }, // 'Complaint', 'Inspection', 'WorkOrder', 'Asset'
    entityId: { type: String, required: true },
    performedBy: {
      userId: { type: String, default: 'SYSTEM' },
      name: { type: String, default: 'AI Verification Engine' },
      role: { type: String, default: 'SYSTEM' },
    },
    riskScoreBefore: { type: Number },
    riskScoreAfter: { type: Number },
    reason: { type: String },
    metaData: { type: mongoose.Schema.Types.Mixed },
    ipAddress: { type: String, default: '127.0.0.1' },
  },
  { timestamps: true }
)

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema)
