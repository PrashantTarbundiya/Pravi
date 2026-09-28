import mongoose from 'mongoose'

const WorkOrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true }, // e.g. 'R&B/WO/2026/089'
    title: { type: String, required: true },
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
    assetCode: { type: String },
    contractor: {
      name: { type: String, required: true },
      contactPerson: { type: String },
      phone: { type: String },
      licenseClass: { type: String, default: 'Class AA' },
    },
    tenderAmountLakhs: { type: Number, required: true },
    sanctionedAmountLakhs: { type: Number, required: true },
    startDate: { type: Date, required: true },
    completionDeadline: { type: Date, required: true },
    dlpPeriodMonths: { type: Number, default: 36 }, // 3 Years Defect Liability Period for R&B roads
    status: {
      type: String,
      enum: ['TENDER_AWARDED', 'IN_EXECUTION', 'PHYSICALLY_COMPLETED', 'UNDER_DLP', 'FINAL_BILL_SETTLED'],
      default: 'IN_EXECUTION',
    },
    milestones: [
      {
        title: { type: String },
        stage: { type: String },
        percentage: { type: Number },
        verifiedPhotosCount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
    ],
    imageUrl: { type: String },
  },
  { timestamps: true }
)

export const WorkOrder = mongoose.model('WorkOrder', WorkOrderSchema)
