import mongoose from 'mongoose'

const ImageStoreSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    contentType: { type: String, required: true, default: 'image/jpeg' },
    size: { type: Number, default: 0 },
    // Binary buffer stored directly in MongoDB
    data: { type: Buffer },
    // Base64 data URI stored in DB for instant inline rendering without disk
    dataUrl: { type: String, required: true },
    source: {
      type: String,
      enum: ['LIVE_CAMERA', 'DEVICE_GALLERY', 'SYSTEM_SEED'],
      default: 'LIVE_CAMERA',
    },
    metadata: {
      category: { type: String },
      captureToken: { type: String },
      coordinates: { type: [Number] },
    },
  },
  { timestamps: true }
)

export const ImageStore = mongoose.model('ImageStore', ImageStoreSchema)
