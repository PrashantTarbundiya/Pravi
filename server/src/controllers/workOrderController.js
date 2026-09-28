import { WorkOrder } from '../models/WorkOrder.js'
import { Asset } from '../models/Asset.js'

export const getWorkOrders = async (req, res) => {
  try {
    const { status, contractor, search } = req.query
    const query = {}

    if (status) query.status = status
    if (contractor) query['contractor.name'] = new RegExp(contractor, 'i')
    if (search) {
      query.$or = [
        { orderNumber: new RegExp(search, 'i') },
        { title: new RegExp(search, 'i') },
        { 'contractor.name': new RegExp(search, 'i') },
      ]
    }

    const orders = await WorkOrder.find(query).sort({ createdAt: -1 }).limit(100)
    res.json({ success: true, count: orders.length, data: orders })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getWorkOrderById = async (req, res) => {
  try {
    const order = await WorkOrder.findById(req.params.id)
    if (!order) return res.status(404).json({ success: false, message: 'Work Order not found' })
    res.json({ success: true, data: order })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createWorkOrder = async (req, res) => {
  try {
    const {
      title,
      assetId,
      assetCode,
      contractor,
      tenderAmountLakhs,
      sanctionedAmountLakhs,
      startDate,
      completionDeadline,
      dlpPeriodMonths,
      milestones,
    } = req.body

    if (!title || !contractor?.name) {
      return res.status(400).json({ success: false, message: 'Title and Contractor Name are required!' })
    }

    const orderNumber = req.body.orderNumber || `R&B/WO/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`

    const defaultMilestones = milestones && milestones.length > 0 ? milestones : [
      { title: 'Subgrade Profiling', percentage: 25, progress: 100, isPaid: true },
      { title: 'WMM Application', percentage: 35, progress: 50, isPaid: false },
      { title: 'DBM & BC Asphalt Layer', percentage: 40, progress: 0, isPaid: false },
    ]

    const order = new WorkOrder({
      orderNumber,
      title,
      assetId,
      assetCode: assetCode || 'RNB-GJ-RD-01',
      contractor: {
        name: contractor.name,
        contactPerson: contractor.contactPerson || 'Contractor Rep',
        phone: contractor.phone || '+91 98000 00000',
        licenseClass: contractor.licenseClass || 'Class AA',
      },
      tenderAmountLakhs: tenderAmountLakhs || 500,
      sanctionedAmountLakhs: sanctionedAmountLakhs || 480,
      startDate: startDate || new Date(),
      completionDeadline: completionDeadline || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      dlpPeriodMonths: dlpPeriodMonths || 36,
      status: 'IN_EXECUTION',
      milestones: defaultMilestones,
    })

    await order.save()
    res.status(201).json({ success: true, data: order, message: 'Work Order created successfully' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const updateWorkOrder = async (req, res) => {
  try {
    const order = await WorkOrder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!order) return res.status(404).json({ success: false, message: 'Work Order not found' })
    res.json({ success: true, data: order })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const deleteWorkOrder = async (req, res) => {
  try {
    const order = await WorkOrder.findByIdAndDelete(req.params.id)
    if (!order) return res.status(404).json({ success: false, message: 'Work Order not found' })
    res.json({ success: true, message: 'Work Order removed successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
