import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { Asset } from '../models/Asset.js'
import { Complaint } from '../models/Complaint.js'
import { Inspection } from '../models/Inspection.js'
import { WorkOrder } from '../models/WorkOrder.js'
import { AuditLog } from '../models/AuditLog.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config()

const MOCK_ASSETS = [
  {
    assetCode: 'RNB-GJ-SH-24',
    name: 'State Highway 24 (SG Highway 6-Lane Expressway Corridor)',
    category: 'ROAD',
    subType: 'STATE_HIGHWAY',
    division: 'Ahmedabad R&B Division (Highways)',
    subDivision: 'Gandhinagar - Ahmedabad Capital Corridor',
    status: 'ACTIVE',
    overallCondition: 86,
    imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&auto=format&fit=crop&q=80',
    photos: [
      { url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&auto=format&fit=crop&q=80', caption: 'SG Highway 6-lane elevated flyover section' },
      { url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=1200&auto=format&fit=crop&q=80', caption: 'Bituminous concrete surface profile' },
    ],
    dlp: {
      isUnderDLP: true,
      contractorName: 'Patel Engineering & Infrastructure Ltd.',
      contractorId: 'PATEL-INFRA-GJ',
      tenderNumber: 'R&B/EPC/2024/091',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2027-03-01'),
      defectPenaltyPending: 0,
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [72.5050, 23.0225],
        [72.5120, 23.0350],
        [72.5200, 23.0520],
        [72.5290, 23.0780],
        [72.5380, 23.1120],
      ],
    },
    segments: [
      {
        segmentCode: 'SH24-SEG-01',
        chainageStart: '0+000',
        chainageEnd: '12+500',
        lengthKm: 12.5,
        conditionScore: 88,
        components: [
          { name: 'Bituminous Concrete (BC 40mm)', type: 'PAVEMENT', material: 'VG-30 Bitumen + Aggregate', conditionScore: 89 },
          { name: 'Paved Shoulder (DBM 50mm)', type: 'SHOULDER', material: 'Dense Bituminous Macadam', conditionScore: 82 },
          { name: 'Median Crash Barrier & Signage', type: 'STRUCTURE', material: 'W-Beam Galvanized Steel', conditionScore: 94 },
        ],
      },
    ],
    financials: {
      constructionCostLakhs: 4850,
      annualMaintenanceBudgetLakhs: 45,
      yearBuilt: 2024,
    },
  },
  {
    assetCode: 'RNB-GJ-MDR-09',
    name: 'Sardar Patel Ring Road (West Expressway Section)',
    category: 'ROAD',
    subType: 'MAJOR_DISTRICT_ROAD',
    division: 'Ahmedabad Rural R&B Division',
    subDivision: 'Bopal-Sanand Bypass Unit',
    status: 'UNDER_DLP',
    overallCondition: 78,
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200&auto=format&fit=crop&q=80',
    photos: [
      { url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200&auto=format&fit=crop&q=80', caption: 'Sardar Patel Ring Road West Carriageway' },
    ],
    dlp: {
      isUnderDLP: true,
      contractorName: 'L&T Heavy Civil Infrastructure Ltd.',
      contractorId: 'LT-CIVIL-INDIA',
      tenderNumber: 'R&B/RING/2023/14',
      startDate: new Date('2023-08-15'),
      endDate: new Date('2026-08-15'),
      defectPenaltyPending: 150000,
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [72.4820, 23.0010],
        [72.4780, 23.0300],
        [72.4850, 23.0650],
        [72.5010, 23.0980],
      ],
    },
    segments: [
      {
        segmentCode: 'SPR-SEG-04',
        chainageStart: '18+200',
        chainageEnd: '34+000',
        lengthKm: 15.8,
        conditionScore: 76,
        components: [
          { name: 'Main Carriageway', type: 'PAVEMENT', material: 'Rigid Pavement PQC 280mm', conditionScore: 82 },
          { name: 'Storm Drain Culvert', type: 'DRAIN', material: 'RCC Box Culvert M-30', conditionScore: 71 },
        ],
      },
    ],
    financials: {
      constructionCostLakhs: 9200,
      annualMaintenanceBudgetLakhs: 75,
      yearBuilt: 2023,
    },
  },
  {
    assetCode: 'RNB-GJ-BR-102',
    name: 'Sabarmati Riverfront 6-Lane Cable-Stayed Iconic Bridge',
    category: 'BRIDGE',
    subType: 'STATE_HIGHWAY',
    division: 'Gujarat R&B Bridges & Structures Division',
    subDivision: 'Central Riverfront Unit',
    status: 'ACTIVE',
    overallCondition: 94,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
    photos: [
      { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80', caption: 'Sabarmati Riverfront Cable Bridge pylon and deck' },
    ],
    dlp: {
      isUnderDLP: false,
      contractorName: 'Afcons Infrastructure Construction Ltd.',
      contractorId: 'AFCONS-BR-01',
      tenderNumber: 'R&B/BR/2021/04',
      startDate: new Date('2021-01-10'),
      endDate: new Date('2024-01-10'),
      defectPenaltyPending: 0,
    },
    geometry: {
      type: 'Point',
      coordinates: [72.5780, 23.0580],
    },
    financials: {
      constructionCostLakhs: 14500,
      annualMaintenanceBudgetLakhs: 95,
      yearBuilt: 2021,
    },
  },
  {
    assetCode: 'RNB-GJ-BLD-001',
    name: 'New Gujarat Sachivalaya (Swarnim Sankul Central Secretariat Complex)',
    category: 'GOVERNMENT_BUILDING',
    subType: 'SECRETARIAT',
    division: 'Capital Project Division, Gandhinagar',
    subDivision: 'Administrative Infrastructure Wing',
    status: 'ACTIVE',
    overallCondition: 96,
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80',
    photos: [
      { url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80', caption: 'Swarnim Sankul Administrative Complex Main Facade' },
    ],
    dlp: {
      isUnderDLP: true,
      contractorName: 'Monte Carlo Infrastructure Ltd.',
      contractorId: 'MC-INFRA-DELHI',
      tenderNumber: 'R&B/BLD/2023/18',
      startDate: new Date('2023-06-15'),
      endDate: new Date('2026-12-31'),
      defectPenaltyPending: 0,
    },
    geometry: {
      type: 'Point',
      coordinates: [72.6369, 23.2156],
    },
    financials: {
      constructionCostLakhs: 38500,
      annualMaintenanceBudgetLakhs: 210,
      yearBuilt: 2023,
    },
  },
  {
    assetCode: 'RNB-GJ-BLD-014',
    name: 'Civil Hospital Super-Specialty Medical Trauma Centre Complex',
    category: 'GOVERNMENT_BUILDING',
    subType: 'HOSPITAL',
    division: 'Ahmedabad Medical Buildings R&B Division',
    subDivision: 'Asarwa Hospital Works',
    status: 'ACTIVE',
    overallCondition: 90,
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1200&auto=format&fit=crop&q=80',
    photos: [
      { url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1200&auto=format&fit=crop&q=80', caption: '1200-Bed Trauma & Emergency Wing' },
    ],
    dlp: {
      isUnderDLP: true,
      contractorName: 'Dilip Buildcon Healthcare Works',
      contractorId: 'DBL-INFRA-BHOPAL',
      tenderNumber: 'R&B/MED/2022/44',
      startDate: new Date('2022-10-01'),
      endDate: new Date('2025-10-01'),
      defectPenaltyPending: 0,
    },
    geometry: {
      type: 'Point',
      coordinates: [72.6025, 23.0515],
    },
    financials: {
      constructionCostLakhs: 22800,
      annualMaintenanceBudgetLakhs: 140,
      yearBuilt: 2022,
    },
  },
  {
    assetCode: 'RNB-GJ-MDR-08',
    name: 'Sanand Industrial Link Road & Heavy Logistics Corridor',
    category: 'ROAD',
    subType: 'MAJOR_DISTRICT_ROAD',
    division: 'Ahmedabad Rural R&B Division',
    subDivision: 'Sanand GIDC Link',
    status: 'MAINTENANCE_REQUIRED',
    overallCondition: 56,
    imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&auto=format&fit=crop&q=80',
    photos: [
      { url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&auto=format&fit=crop&q=80', caption: 'Industrial freight traffic corridor' },
    ],
    dlp: {
      isUnderDLP: false,
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [72.3850, 22.9750],
        [72.4120, 22.9840],
        [72.4418, 22.9981],
      ],
    },
    segments: [
      {
        segmentCode: 'SND-SEG-01',
        chainageStart: '0+000',
        chainageEnd: '8+400',
        lengthKm: 8.4,
        conditionScore: 54,
        components: [
          { name: 'Bituminous Wearing Layer', type: 'PAVEMENT', material: 'Bitumen VG-30', conditionScore: 48 },
          { name: 'Side Drain Network', type: 'DRAIN', material: 'Earthen Ditch', conditionScore: 58 },
        ],
      },
    ],
    financials: {
      constructionCostLakhs: 1450,
      annualMaintenanceBudgetLakhs: 30,
      yearBuilt: 2018,
    },
  },
  {
    assetCode: 'RNB-GJ-FLY-07',
    name: 'Thaltej Multi-Tier Junction Flyover & Underpass',
    category: 'FLYOVER',
    subType: 'STATE_HIGHWAY',
    division: 'Ahmedabad City R&B Bridges Unit',
    subDivision: 'Western Flyovers',
    status: 'ACTIVE',
    overallCondition: 91,
    imageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1200&auto=format&fit=crop&q=80',
    photos: [
      { url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1200&auto=format&fit=crop&q=80', caption: 'Elevated cantilever flyover structure' },
    ],
    dlp: {
      isUnderDLP: true,
      contractorName: 'Patel Engineering & Infrastructure Ltd.',
      contractorId: 'PATEL-INFRA-GJ',
      tenderNumber: 'R&B/FLY/2023/07',
      startDate: new Date('2023-04-01'),
      endDate: new Date('2026-04-01'),
      defectPenaltyPending: 0,
    },
    geometry: {
      type: 'Point',
      coordinates: [72.5185, 23.0525],
    },
    financials: {
      constructionCostLakhs: 7400,
      annualMaintenanceBudgetLakhs: 48,
      yearBuilt: 2023,
    },
  },
  {
    assetCode: 'RNB-GJ-EXP-01',
    name: 'Dholera SIR Greenfield 8-Lane Smart Expressway Corridor',
    category: 'ROAD',
    subType: 'STATE_HIGHWAY',
    division: 'Special Infrastructure Projects R&B Division',
    subDivision: 'Dholera Highway Wing',
    status: 'UNDER_DLP',
    overallCondition: 98,
    imageUrl: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=1200&auto=format&fit=crop&q=80',
    photos: [
      { url: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=1200&auto=format&fit=crop&q=80', caption: '8-lane high speed expressway alignment' },
    ],
    dlp: {
      isUnderDLP: true,
      contractorName: 'L&T Heavy Civil Infrastructure Ltd.',
      contractorId: 'LT-CIVIL-INDIA',
      tenderNumber: 'R&B/EXP/2024/002',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2029-01-01'),
      defectPenaltyPending: 0,
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [72.5500, 22.8500],
        [72.4800, 22.7000],
        [72.3500, 22.5000],
        [72.2200, 22.2500],
      ],
    },
    segments: [
      {
        segmentCode: 'DHO-SEG-01',
        chainageStart: '0+000',
        chainageEnd: '45+000',
        lengthKm: 45.0,
        conditionScore: 98,
        components: [
          { name: 'PQC Rigid Concrete 320mm', type: 'PAVEMENT', material: 'M-40 Concrete with Dowel Bars', conditionScore: 99 },
          { name: 'Drainage Median & Crash Attenuators', type: 'DRAIN', material: 'Reinforced Concrete Pre-Cast', conditionScore: 97 },
        ],
      },
    ],
    financials: {
      constructionCostLakhs: 42000,
      annualMaintenanceBudgetLakhs: 180,
      yearBuilt: 2024,
    },
  },
]

const MOCK_COMPLAINTS = [
  {
    ticketNumber: 'RNB-GRV-2026-0081',
    title: 'Severe pothole cluster across middle lane near Thaltej flyover',
    description: 'Multiple 15cm deep potholes causing two-wheeler skidding hazards during heavy rain.',
    category: 'POTHOLE',
    severity: 'HIGH',
    status: 'ASSIGNED_TO_CONTRACTOR',
    location: {
      address: 'SG Highway Ch 4+200, Near Thaltej Underpass, Ahmedabad',
      coordinates: [72.5189, 23.0521],
      assetCode: 'RNB-GJ-SH-24',
    },
    reportedBy: { name: 'Vikram Mehta', phone: '+91 98250 11223', isAnonymous: false },
    evidence: {
      imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1000&auto=format&fit=crop&q=80',
      captureToken: 'LIVE-VERIFIED-98fa',
      source: 'LIVE_CAMERA',
      isLiveCapture: true,
      gpsDistanceMeters: 6,
      isWithinGeofence: true,
      exifAnalysis: {
        deviceModel: 'Samsung Galaxy A54',
        software: 'InfraManage Live Cam v2',
        hasEditingArtifacts: false,
        tamperProbability: 0.03,
      },
      aiClassification: {
        predictedDefect: 'POTHOLE',
        confidence: 0.96,
        surfaceIntegrityRisk: 88,
        model: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
        reasoning: 'Step 1: Visual sensor evaluation reveals sharp cavity edge breakdown with loss of binder course.\nStep 2: Depth measured ~14cm with water stagnation potential, presenting acute skidding risk for high-speed corridor traffic.\nStep 3: IRC:82 specifies rectangular edge squaring, tack coat with RS-1 bitumen emulsion, and pneumatic compaction of hot-mix DBM.',
        reasoningTokens: 184,
        standardRepairMethod: 'Square-cut excavation to sound pavement, tack coat application, and compacted dense bituminous macadam (DBM).',
      },
      overallRiskScore: 12,
      verifiedByAuditor: true,
      auditorNotes: 'Auditor verified live camera proof. Priority dispatch issued to Patel Infra under 3-yr DLP warranty.',
    },
    slaDeadline: new Date(Date.now() + 36 * 60 * 60 * 1000),
  },
  {
    ticketNumber: 'RNB-GRV-2026-0082',
    title: 'Suspicious defect upload with mismatched GPS & altered photo',
    description: 'Citizen submitted image claiming bridge crack, but GPS fix was 4.8km away in residential society.',
    category: 'BRIDGE_EXPANSION_JOINT',
    severity: 'CRITICAL',
    status: 'FLAGGED_SUSPICIOUS',
    location: {
      address: 'Claimed: Sabarmati Riverfront Bridge / Actual GPS: 4.8km away',
      coordinates: [72.5401, 23.0805],
      assetCode: 'RNB-GJ-BR-102',
    },
    reportedBy: { name: 'Anonymous Submitter', isAnonymous: true },
    evidence: {
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop&q=80',
      captureToken: 'GALLERY-VERIFIED',
      source: 'DEVICE_GALLERY',
      isLiveCapture: false,
      gpsDistanceMeters: 4800,
      isWithinGeofence: false,
      exifAnalysis: {
        deviceModel: 'Unknown / Stripped EXIF',
        software: 'Adobe Photoshop 2025',
        hasEditingArtifacts: true,
        tamperProbability: 0.88,
      },
      aiClassification: {
        predictedDefect: 'SUSPICIOUS_ARTIFACT',
        confidence: 0.42,
        surfaceIntegrityRisk: 25,
        model: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
        reasoning: 'Step 1: EXIF parsing discovered Adobe Photoshop 2025 encoding markers and stripped hardware timestamp.\nStep 2: Geodesic calculation places user coordinate 4,800m away from Sabarmati Bridge alignment.\nStep 3: Recommend quarantine for human auditor review under Anti-Fraud Protocol Section 14.',
        reasoningTokens: 215,
        standardRepairMethod: 'Physical inspection required by Junior Engineer before releasing contractor penalty.',
      },
      overallRiskScore: 84,
      verifiedByAuditor: false,
    },
    slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    ticketNumber: 'RNB-GRV-2026-0083',
    title: 'Extensive alligator cracking and bituminous rutting on Sanand corridor',
    description: 'Continuous fatigue cracking spanning 80 meters due to heavily loaded industrial logistics trucks.',
    category: 'CRACKING',
    severity: 'HIGH',
    status: 'WORK_IN_PROGRESS',
    location: {
      address: 'Sanand Industrial Link Road Ch 3+400, Ahmedabad',
      coordinates: [72.4120, 22.9840],
      assetCode: 'RNB-GJ-MDR-08',
    },
    reportedBy: { name: 'Pravin Solanki', phone: '+91 97120 44551', isAnonymous: false },
    evidence: {
      imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1000&auto=format&fit=crop&q=80',
      captureToken: 'LIVE-VERIFIED-77fa',
      source: 'LIVE_CAMERA',
      isLiveCapture: true,
      gpsDistanceMeters: 4,
      isWithinGeofence: true,
      exifAnalysis: {
        deviceModel: 'OnePlus 11 5G',
        software: 'InfraManage Live Cam v2',
        hasEditingArtifacts: false,
        tamperProbability: 0.04,
      },
      aiClassification: {
        predictedDefect: 'CRACKING',
        confidence: 0.94,
        surfaceIntegrityRisk: 82,
        model: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
        reasoning: 'Step 1: Interconnected fatigue cracking pattern indicative of sub-base tensile stress exceeding elastic limit.\nStep 2: Water penetration will accelerate base failure if not sealed prior to monsoon.\nStep 3: Cold-milling of top 50mm followed by SAMI (Stress Absorbing Membrane Interlayer) and 40mm BC overlay recommended.',
        reasoningTokens: 198,
        standardRepairMethod: 'Cold milling of wearing course, elastomeric crack sealant, and 40mm Bituminous Concrete overlay.',
      },
      overallRiskScore: 10,
      verifiedByAuditor: true,
      auditorNotes: 'Work order RNB/WO/2026/092 sanctioned. Contractor Dilip Buildcon mobilization started.',
    },
    slaDeadline: new Date(Date.now() + 72 * 60 * 60 * 1000),
  },
  {
    ticketNumber: 'RNB-GRV-2026-0084',
    title: 'RCC culvert drainage overflow causing 1-foot waterlogging',
    description: 'Clogged silt buildup in roadside storm drain causing water overflow across two highway lanes.',
    category: 'DRAINAGE_OVERFLOW',
    severity: 'CRITICAL',
    status: 'SUBMITTED',
    location: {
      address: 'SP Ring Road KM 24 near Bopal Junction, Ahmedabad',
      coordinates: [72.4820, 23.0300],
      assetCode: 'RNB-GJ-MDR-09',
    },
    reportedBy: { name: 'Harsh Vardhan', phone: '+91 94280 66772', isAnonymous: false },
    evidence: {
      imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=1000&auto=format&fit=crop&q=80',
      captureToken: 'LIVE-VERIFIED-44ab',
      source: 'LIVE_CAMERA',
      isLiveCapture: true,
      gpsDistanceMeters: 5,
      isWithinGeofence: true,
      exifAnalysis: {
        deviceModel: 'Apple iPhone 14 Pro',
        software: 'InfraManage Live Cam v2',
        hasEditingArtifacts: false,
        tamperProbability: 0.02,
      },
      aiClassification: {
        predictedDefect: 'DRAINAGE_OVERFLOW',
        confidence: 0.95,
        surfaceIntegrityRisk: 90,
        model: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
        reasoning: 'Step 1: Visual sensor detects extensive standing water over both carriage lanes, obscuring pavement markings.\nStep 2: Risk of hydroplaning for 80 km/h expressway vehicles is extreme.\nStep 3: Immediate high-pressure suction de-silting and temporary sandbag deflection channel required.',
        reasoningTokens: 172,
        standardRepairMethod: 'High-pressure vacuum de-silting and repair of damaged concrete catch-pit grating.',
      },
      overallRiskScore: 8,
      verifiedByAuditor: false,
    },
    slaDeadline: new Date(Date.now() + 18 * 60 * 60 * 1000),
  },
  {
    ticketNumber: 'RNB-GRV-2026-0085',
    title: 'Bridge expansion joint finger plate loosening with loud rattling sound',
    description: 'Vehicles hitting loose steel finger plate causing loud metallic thud and tire puncture risks.',
    category: 'BRIDGE_EXPANSION_JOINT',
    severity: 'HIGH',
    status: 'ASSIGNED_TO_CONTRACTOR',
    location: {
      address: 'Sabarmati Riverfront Bridge Pier 3, Ahmedabad',
      coordinates: [72.5780, 23.0580],
      assetCode: 'RNB-GJ-BR-102',
    },
    reportedBy: { name: 'Deepak Bhatt', phone: '+91 98980 33441', isAnonymous: false },
    evidence: {
      imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1000&auto=format&fit=crop&q=80',
      captureToken: 'LIVE-VERIFIED-8812',
      source: 'LIVE_CAMERA',
      isLiveCapture: true,
      gpsDistanceMeters: 3,
      isWithinGeofence: true,
      exifAnalysis: {
        deviceModel: 'Vivo V29 Pro',
        software: 'InfraManage Live Cam v2',
        hasEditingArtifacts: false,
        tamperProbability: 0.03,
      },
      aiClassification: {
        predictedDefect: 'BRIDGE_EXPANSION_JOINT',
        confidence: 0.97,
        surfaceIntegrityRisk: 85,
        model: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
        reasoning: 'Step 1: Loose modular expansion joint finger plate confirmed.\nStep 2: Vibration impact risks anchorage failure into bridge deck slab.\nStep 3: Fast-setting epoxy grout anchoring and torque verification required under IRC:SP:69.',
        reasoningTokens: 165,
        standardRepairMethod: 'Anchor re-drilling with Hilti epoxy mortar and high-tensile bolt torque tightening.',
      },
      overallRiskScore: 11,
      verifiedByAuditor: true,
      auditorNotes: 'Afcons emergency maintenance unit dispatched for night traffic block repair.',
    },
    slaDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
  },
  {
    ticketNumber: 'RNB-GRV-2026-0086',
    title: 'Severe road cave-in and pavement settlement near Thaltej service road',
    description: 'Sudden collapse of pavement base course creating 35cm subsidence cavity threatening foundation of street light mast.',
    category: 'ROAD_CAVING',
    severity: 'CRITICAL',
    status: 'WORK_IN_PROGRESS',
    location: {
      address: 'Thaltej Underpass Service Road East, Ahmedabad',
      coordinates: [72.5185, 23.0525],
      assetCode: 'RNB-GJ-FLY-07',
    },
    reportedBy: { name: 'Kavita Dave', phone: '+91 97240 55112', isAnonymous: false },
    evidence: {
      imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1000&auto=format&fit=crop&q=80',
      captureToken: 'LIVE-VERIFIED-55cc',
      source: 'LIVE_CAMERA',
      isLiveCapture: true,
      gpsDistanceMeters: 2,
      isWithinGeofence: true,
      exifAnalysis: {
        deviceModel: 'Google Pixel 8',
        software: 'InfraManage Live Cam v2',
        hasEditingArtifacts: false,
        tamperProbability: 0.01,
      },
      aiClassification: {
        predictedDefect: 'ROAD_CAVING',
        confidence: 0.98,
        surfaceIntegrityRisk: 95,
        model: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
        reasoning: 'Step 1: Visual sensor identifies deep shear sinkhole with void beneath asphalt crust.\nStep 2: Sub-base water ingress from broken utility conduit likely washed away fines.\nStep 3: Barricading required immediately. Backfill with lean concrete (M-10) and dense bitumen overlay.',
        reasoningTokens: 195,
        standardRepairMethod: 'Controlled low-strength material (CLSM) flowable fill, geotextile wrap, and 100mm DBM + 40mm BC reinstatement.',
      },
      overallRiskScore: 9,
      verifiedByAuditor: true,
      auditorNotes: 'Barricades erected. Repair gang on site with tandem roller and backhoe loader.',
    },
    slaDeadline: new Date(Date.now() + 12 * 60 * 60 * 1000),
  },
]

const MOCK_WORK_ORDERS = [
  {
    orderNumber: 'RNB/WO/2026/089',
    title: 'Resurfacing & Rut Repair of SH-24 KM 0 to 12.5 (SG Highway)',
    assetCode: 'RNB-GJ-SH-24',
    imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&auto=format&fit=crop&q=80',
    contractor: {
      name: 'Patel Engineering & Infrastructure Ltd.',
      contactPerson: 'Ketan Patel (Project Director)',
      phone: '+91 99241 88200',
      licenseClass: 'Special Class I (Roads & Bridges)',
    },
    tenderAmountLakhs: 840,
    sanctionedAmountLakhs: 820,
    startDate: new Date('2026-01-15'),
    completionDeadline: new Date('2026-11-30'),
    dlpPeriodMonths: 36,
    status: 'IN_EXECUTION',
    milestones: [
      { title: 'Subgrade Profiling & Base Milling', stage: 'Milling', percentage: 25, isPaid: true, verifiedPhotosCount: 3 },
      { title: 'WMM Base Application & 98% Compaction', stage: 'WMM', percentage: 35, isPaid: true, verifiedPhotosCount: 4 },
      { title: 'Dense Bituminous Macadam (DBM 50mm)', stage: 'DBM', percentage: 25, isPaid: false, verifiedPhotosCount: 2 },
      { title: 'Bituminous Concrete (BC 40mm) Wearing Surface', stage: 'Wearing Layer', percentage: 15, isPaid: false, verifiedPhotosCount: 0 },
    ],
  },
  {
    orderNumber: 'RNB/WO/2026/092',
    title: 'Reconstruction & Strengthening of Sanand Industrial Logistics Corridor',
    assetCode: 'RNB-GJ-MDR-08',
    imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&auto=format&fit=crop&q=80',
    contractor: {
      name: 'Dilip Buildcon Infrastructure Ltd.',
      contactPerson: 'Rameshwar Jha (DGM Projects)',
      phone: '+91 98112 55667',
      licenseClass: 'Class AA Highway Contractor',
    },
    tenderAmountLakhs: 1480,
    sanctionedAmountLakhs: 1450,
    startDate: new Date('2026-02-01'),
    completionDeadline: new Date('2027-01-31'),
    dlpPeriodMonths: 60,
    status: 'IN_EXECUTION',
    milestones: [
      { title: 'Drainage Widening & Box Culvert Extensions', stage: 'Drainage', percentage: 20, isPaid: true, verifiedPhotosCount: 5 },
      { title: 'Cement Stabilized Sub-Base (CTSB 200mm)', stage: 'CTSB', percentage: 30, isPaid: false, verifiedPhotosCount: 1 },
      { title: 'Dense Bituminous Macadam (DBM 75mm)', stage: 'DBM', percentage: 30, isPaid: false, verifiedPhotosCount: 0 },
      { title: 'Polymer Modified Bitumen Wearing Surface', stage: 'PMB', percentage: 20, isPaid: false, verifiedPhotosCount: 0 },
    ],
  },
  {
    orderNumber: 'RNB/WO/2026/098',
    title: 'Acoustic Health Audit & Stay Cable Tensioning of Sabarmati Cable Bridge',
    assetCode: 'RNB-GJ-BR-102',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
    contractor: {
      name: 'Afcons Infrastructure Construction Ltd.',
      contactPerson: 'Dr. Sunil Kulkarni (Bridge Specialist)',
      phone: '+91 98200 44112',
      licenseClass: 'Specialist Bridge Engineering',
    },
    tenderAmountLakhs: 620,
    sanctionedAmountLakhs: 615,
    startDate: new Date('2026-03-01'),
    completionDeadline: new Date('2026-08-31'),
    dlpPeriodMonths: 36,
    status: 'IN_EXECUTION',
    milestones: [
      { title: 'Non-Destructive Ultrasound Cable Scanning', stage: 'Scanning', percentage: 30, isPaid: true, verifiedPhotosCount: 8 },
      { title: 'Hydraulic Jack Re-tensioning to Design Spec', stage: 'Tensioning', percentage: 40, isPaid: true, verifiedPhotosCount: 6 },
      { title: 'Damping Device Replacement & Painting', stage: 'Dampers', percentage: 30, isPaid: false, verifiedPhotosCount: 0 },
    ],
  },
  {
    orderNumber: 'RNB/WO/2026/104',
    title: 'Emergency Pothole Patching & Slurry Seal - Thaltej Underpass Ramps',
    assetCode: 'RNB-GJ-FLY-07',
    imageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1200&auto=format&fit=crop&q=80',
    contractor: {
      name: 'Patel Engineering & Infrastructure Ltd.',
      contactPerson: 'Ketan Patel',
      phone: '+91 99241 88200',
      licenseClass: 'Special Class I',
    },
    tenderAmountLakhs: 48,
    sanctionedAmountLakhs: 48,
    startDate: new Date('2026-09-01'),
    completionDeadline: new Date('2026-10-15'),
    dlpPeriodMonths: 12,
    status: 'IN_EXECUTION',
    milestones: [
      { title: 'Milling & Cold-Mix Patching', stage: 'Milling', percentage: 60, isPaid: true, verifiedPhotosCount: 4 },
      { title: 'Micro-surfacing Seal Coat Application', stage: 'Seal Coat', percentage: 40, isPaid: false, verifiedPhotosCount: 1 },
    ],
  },
]

const MOCK_INSPECTIONS = [
  {
    inspectionCode: 'INSP-RNB-2026-101',
    assetCode: 'RNB-GJ-SH-24',
    segmentCode: 'SH24-SEG-01',
    inspectorName: 'Er. Rajesh Parmar (DEE R&B)',
    inspectorRole: 'Deputy Executive Engineer',
    inspectionType: 'CONSTRUCTION_STAGE',
    stageLayer: 'BC_WEARING_SURFACE',
    coordinates: [72.5189, 23.0521],
    distanceFromSegmentMeters: 4,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=1000&auto=format&fit=crop&q=80',
        captureToken: 'LIVE-VERIFIED-101',
        riskScore: 5,
        isLiveCapture: true,
        aiConfidence: 0.98,
        notes: 'Bitumen laying temp recorded at 155°C. Compaction achieved 98.4% MDD.',
      },
    ],
    qualityScore: 94,
    remarks: 'Bitumen penetration grade VG-30 conforms to MORTH Section 500. Pneumatic tandem rollers achieved specified density.',
    status: 'PASSED',
  },
  {
    inspectionCode: 'INSP-RNB-2026-102',
    assetCode: 'RNB-GJ-MDR-09',
    segmentCode: 'SPR-SEG-04',
    inspectorName: 'Er. Meera Trivedi (AEE Quality Control)',
    inspectorRole: 'Assistant Executive Engineer',
    inspectionType: 'DLP_WARRANTY_CHECK',
    stageLayer: 'BC_WEARING_SURFACE',
    coordinates: [72.4820, 23.0300],
    distanceFromSegmentMeters: 6,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1000&auto=format&fit=crop&q=80',
        captureToken: 'LIVE-VERIFIED-102',
        riskScore: 7,
        isLiveCapture: true,
        aiConfidence: 0.96,
        notes: 'Annual DLP inspection of SP Ring Road segment.',
      },
    ],
    qualityScore: 88,
    remarks: 'Minor edge ravelling detected between Ch 21+400 to 21+800. Notice issued to contractor under 36-month DLP guarantee.',
    status: 'PASSED',
  },
  {
    inspectionCode: 'INSP-RNB-2026-103',
    assetCode: 'RNB-GJ-BR-102',
    segmentCode: 'SAB-BR-01',
    inspectorName: 'Er. Rajesh Parmar (DEE R&B)',
    inspectorRole: 'Deputy Executive Engineer',
    inspectionType: 'QUALITY_AUDIT',
    stageLayer: 'DRAIN_STRUCTURE',
    coordinates: [72.5780, 23.0580],
    distanceFromSegmentMeters: 3,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80',
        captureToken: 'LIVE-VERIFIED-103',
        riskScore: 4,
        isLiveCapture: true,
        aiConfidence: 0.99,
        notes: 'Sabarmati cable deck expansion audit.',
      },
    ],
    qualityScore: 96,
    remarks: 'Structural vibration sensors and expansion joints checked. No thermal distortion.',
    status: 'PASSED',
  },
]

async function seed() {
  try {
    console.log('[Seed]: Connecting to MongoDB Atlas cluster...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('[Seed]: Connected! Purging existing records...')

    await Asset.deleteMany({})
    await Complaint.deleteMany({})
    await Inspection.deleteMany({})
    await WorkOrder.deleteMany({})
    await AuditLog.deleteMany({})

    console.log('[Seed]: Inserting 8 hyper-realistic R&B infrastructure assets with high-res photos...')
    const createdAssets = await Asset.insertMany(MOCK_ASSETS)
    const assetMap = {}
    createdAssets.forEach((a) => {
      assetMap[a.assetCode] = a._id
    })

    console.log('[Seed]: Inserting realistic complaints with Nemotron-3 reasoning details & photos...')
    const complaintsToInsert = MOCK_COMPLAINTS.map((c) => ({
      ...c,
      location: {
        ...c.location,
        assetId: assetMap[c.location.assetCode] || createdAssets[0]._id,
      },
    }))
    await Complaint.insertMany(complaintsToInsert)

    console.log('[Seed]: Inserting active EPC work orders with milestones and budgets...')
    const workOrdersToInsert = MOCK_WORK_ORDERS.map((wo) => ({
      ...wo,
      assetId: assetMap[wo.assetCode] || createdAssets[0]._id,
    }))
    await WorkOrder.insertMany(workOrdersToInsert)

    console.log('[Seed]: Inserting certified field quality inspections...')
    const inspectionsToInsert = MOCK_INSPECTIONS.map((insp) => ({
      ...insp,
      assetId: assetMap[insp.assetCode] || createdAssets[0]._id,
    }))
    await Inspection.insertMany(inspectionsToInsert)

    console.log('[Seed]: Generating immutable forensic audit ledger...')
    await AuditLog.create([
      {
        action: 'IMAGE_VERIFIED',
        entityType: 'Complaint',
        entityId: 'RNB-GRV-2026-0081',
        riskScoreBefore: 0,
        riskScoreAfter: 12,
        reason: 'Automated 4-layer check: AUTO_APPROVE (Source: Live Camera Verified)',
        metaData: {
          model: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
          reasoningTokens: 184,
          defect: 'POTHOLE',
        },
      },
      {
        action: 'AUDITOR_OVERRIDE',
        entityType: 'Complaint',
        entityId: 'RNB-GRV-2026-0082',
        riskScoreBefore: 84,
        riskScoreAfter: 84,
        reason: 'Flagged for Vigilance: Geodesic mismatch 4.8km & Photoshop 2025 tags',
        metaData: {
          model: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
          tamperProbability: 0.88,
        },
      },
      {
        action: 'IMAGE_VERIFIED',
        entityType: 'Inspection',
        entityId: 'INSP-RNB-2026-101',
        riskScoreBefore: 0,
        riskScoreAfter: 5,
        reason: 'Stage inspection passed for BC wearing surface (Quality Score: 94)',
        metaData: {
          tempC: 155,
          compactionDensity: '98.4% MDD',
        },
      },
    ])

    console.log('[Seed]: SUCCESS! All real-world R&B assets, high-res photos, complaints, and tenders seeded!')
    process.exit(0)
  } catch (error) {
    console.error('[Seed Error]:', error)
    process.exit(1)
  }
}

seed()
