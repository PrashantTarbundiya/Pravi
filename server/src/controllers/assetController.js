import { Asset } from '../models/Asset.js'

export const getAssets = async (req, res) => {
  try {
    const { category, status, division, minCondition, underDlp, search } = req.query
    const query = {}

    if (category && category !== 'ALL') query.category = category
    if (status) query.status = status
    if (division) query.division = new RegExp(division, 'i')
    if (underDlp === 'true') query['dlp.isUnderDLP'] = true
    if (minCondition) query.overallCondition = { $gte: Number(minCondition) }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { assetCode: new RegExp(search, 'i') },
        { division: new RegExp(search, 'i') },
      ]
    }

    const assets = await Asset.find(query).sort({ updatedAt: -1 }).limit(100)
    res.json({ success: true, count: assets.length, data: assets })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' })
    res.json({ success: true, data: asset })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createAsset = async (req, res) => {
  try {
    const {
      name,
      category,
      subType,
      division,
      subDivision,
      overallCondition,
      dlp,
      financials,
      geometry,
    } = req.body

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Asset Name and Category are required!' })
    }

    const categoryPrefix = category === 'ROAD' ? 'RD' : category === 'BRIDGE' ? 'BR' : category === 'GOVERNMENT_BUILDING' ? 'BLD' : 'INF'
    const generatedCode = req.body.assetCode || `RNB-GJ-${categoryPrefix}-${Math.floor(1000 + Math.random() * 9000)}`

    const asset = new Asset({
      assetCode: generatedCode,
      name,
      category,
      subType: subType || 'STATE_HIGHWAY',
      division: division || 'Ahmedabad R&B Division',
      subDivision: subDivision || 'Sub-Division 1',
      overallCondition: overallCondition !== undefined ? Number(overallCondition) : 85,
      status: overallCondition < 60 ? 'MAINTENANCE_REQUIRED' : 'ACTIVE',
      dlp: dlp || {
        isUnderDLP: false,
      },
      geometry: geometry || {
        type: 'Point',
        coordinates: [72.5714, 23.0225],
      },
      financials: financials || {
        constructionCostLakhs: 500,
        annualMaintenanceBudgetLakhs: 20,
        yearBuilt: new Date().getFullYear(),
      },
      lastInspectionDate: new Date(),
    })

    await asset.save()
    res.status(201).json({ success: true, data: asset, message: 'Asset successfully registered in R&B database' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' })
    res.json({ success: true, data: asset })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id)
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' })
    res.json({ success: true, message: 'Asset removed successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
