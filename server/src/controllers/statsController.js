import { Asset } from '../models/Asset.js'
import { Complaint } from '../models/Complaint.js'
import { Inspection } from '../models/Inspection.js'
import { WorkOrder } from '../models/WorkOrder.js'

export const getDashboardSummary = async (req, res) => {
  try {
    const totalAssets = await Asset.countDocuments()
    const roadsCount = await Asset.countDocuments({ category: 'ROAD' })
    const bridgesCount = await Asset.countDocuments({ category: 'BRIDGE' })
    const buildingsCount = await Asset.countDocuments({ category: 'GOVERNMENT_BUILDING' })
    const dlpAssetsCount = await Asset.countDocuments({ 'dlp.isUnderDLP': true })

    const totalComplaints = await Complaint.countDocuments()
    const openComplaints = await Complaint.countDocuments({
      status: { $in: ['SUBMITTED', 'PENDING_AI_VERIFICATION', 'FLAGGED_SUSPICIOUS', 'ASSIGNED_TO_CONTRACTOR', 'WORK_IN_PROGRESS'] },
    })
    const resolvedComplaints = await Complaint.countDocuments({ status: 'RESOLVED' })
    const flaggedComplaints = await Complaint.countDocuments({ 'evidence.overallRiskScore': { $gte: 50 } })

    const activeWorkOrders = await WorkOrder.countDocuments({ status: 'IN_EXECUTION' })
    const recentInspections = await Inspection.find().sort({ createdAt: -1 }).limit(5)

    res.json({
      success: true,
      kpis: {
        totalAssets,
        breakdown: { roads: roadsCount, bridges: bridgesCount, buildings: buildingsCount },
        dlpProtectedAssets: dlpAssetsCount,
        openComplaints,
        resolvedComplaints,
        flaggedSuspiciousPhotos: flaggedComplaints,
        activeWorkOrders,
      },
      recentInspections,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
