import mongoose from 'mongoose'

const ComponentSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. 'Carriageway', 'Shoulder', 'Culvert Ch 4+200'
  type: { type: String, enum: ['PAVEMENT', 'SHOULDER', 'DRAIN', 'SIGNAGE', 'LIGHTING', 'ROOF', 'STRUCTURE'], default: 'PAVEMENT' },
  material: { type: String }, // e.g., 'Bituminous Concrete', 'RCC', 'WMM'
  conditionScore: { type: Number, min: 0, max: 100, default: 85 },
  lastInspected: { type: Date, default: Date.now },
})

const SegmentSchema = new mongoose.Schema({
  segmentCode: { type: String, required: true }, // e.g., 'SEG-001'
  chainageStart: { type: String }, // e.g., '0+000'
  chainageEnd: { type: String }, // e.g., '5+200'
  lengthKm: { type: Number },
  coordinates: {
    type: [[Number]], // [[lng, lat], [lng, lat], ...]
    default: [],
  },
  components: [ComponentSchema],
  conditionScore: { type: Number, min: 0, max: 100, default: 80 },
})

const AssetSchema = new mongoose.Schema(
  {
    assetCode: { type: String, required: true, unique: true, index: true }, // e.g. 'RNB-GJ-SH-24'
    name: { type: String, required: true },
    department: { type: String, default: 'Roads & Buildings Department (R&B)' },
    category: {
      type: String,
      enum: ['ROAD', 'BRIDGE', 'GOVERNMENT_BUILDING', 'DRAINAGE', 'CULVERT', 'FLYOVER'],
      required: true,
      index: true,
    },
    subType: {
      type: String,
      enum: ['STATE_HIGHWAY', 'MAJOR_DISTRICT_ROAD', 'OTHER_DISTRICT_ROAD', 'VILLAGE_ROAD', 'HOSPITAL', 'COLLECTOR_OFFICE', 'CIRCUIT_HOUSE', 'SECRETARIAT', 'OTHER'],
      default: 'STATE_HIGHWAY',
    },
    division: { type: String, default: 'Ahmedabad R&B Division' },
    subDivision: { type: String, default: 'Sub-Division 1' },
    status: {
      type: String,
      enum: ['ACTIVE', 'UNDER_CONSTRUCTION', 'MAINTENANCE_REQUIRED', 'UNDER_DLP', 'DECOMMISSIONED'],
      default: 'ACTIVE',
      index: true,
    },
    overallCondition: { type: Number, min: 0, max: 100, default: 82 }, // Pavement Condition Index (PCI)
    // R&B Defect Liability Period (DLP) & Contractor Warranty
    dlp: {
      isUnderDLP: { type: Boolean, default: false },
      contractorName: { type: String },
      contractorId: { type: String },
      tenderNumber: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      defectPenaltyPending: { type: Number, default: 0 },
    },
    geometry: {
      type: {
        type: String,
        enum: ['Point', 'LineString', 'Polygon'],
        default: 'Point',
      },
      coordinates: {
        type: mongoose.Schema.Types.Mixed, // [lng, lat] or [[lng, lat]...]
        default: [72.5714, 23.0225],
      },
    },
    segments: [SegmentSchema],
    financials: {
      constructionCostLakhs: { type: Number, default: 0 },
      annualMaintenanceBudgetLakhs: { type: Number, default: 0 },
      yearBuilt: { type: Number, default: 2022 },
    },
    imageUrl: { type: String },
    photos: [
      {
        url: { type: String },
        caption: { type: String },
        takenAt: { type: Date, default: Date.now },
      },
    ],
    lastInspectionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const Asset = mongoose.model('Asset', AssetSchema)
