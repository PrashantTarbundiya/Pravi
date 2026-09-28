import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { useRoleStore } from '@/stores/useRoleStore'
import { RnbLogo } from '@/components/RnbLogo'
import {
  Search,
  Plus,
  RefreshCw,
  ShieldCheck,
  Building2,
  CheckCircle2,
  LayoutGrid,
  List,
  Eye,
  MapPin,
  Calendar,
  IndianRupee,
  Layers,
} from 'lucide-react'

export default function AssetRegistry() {
  const { activeRole, can } = useRoleStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [dlpOnly, setDlpOnly] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)

  // Asset Detail Modal State
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Dialog State for Adding New Asset
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'ROAD',
    subType: 'STATE_HIGHWAY',
    division: 'Ahmedabad R&B Division',
    overallCondition: 88,
    isUnderDlp: false,
    contractorName: 'Patel Engineering & Infrastructure Ltd.',
    tenderNumber: '',
    constructionCostLakhs: 850,
    imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&auto=format&fit=crop&q=80',
  })

  const loadAssets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter)
      if (dlpOnly) params.append('underDlp', 'true')
      if (searchTerm) params.append('search', searchTerm)

      const res = await api.getAssets(params.toString())
      if (res.success) {
        setAssets(res.data)
      }
    } catch (err) {
      console.error('Failed to load assets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssets()
  }, [categoryFilter, dlpOnly])

  const handleCreateAsset = async (e) => {
    e.preventDefault()
    if (!newAsset.name.trim()) return alert('Please enter asset name!')
    try {
      setSaving(true)
      const payload = {
        name: newAsset.name,
        category: newAsset.category,
        subType: newAsset.subType,
        division: newAsset.division,
        overallCondition: Number(newAsset.overallCondition),
        imageUrl: newAsset.imageUrl,
        dlp: {
          isUnderDLP: newAsset.isUnderDlp,
          contractorName: newAsset.contractorName || 'State Empanelled Contractor',
          tenderNumber: newAsset.tenderNumber || `R&B/TN/${new Date().getFullYear()}/${Math.floor(10 + Math.random() * 90)}`,
          startDate: new Date(),
          endDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000),
        },
        financials: {
          constructionCostLakhs: Number(newAsset.constructionCostLakhs),
          annualMaintenanceBudgetLakhs: 35,
          yearBuilt: new Date().getFullYear(),
        },
      }
      const res = await api.createAsset(payload)
      if (res.success) {
        setIsDialogOpen(false)
        setNewAsset({
          name: '',
          category: 'ROAD',
          subType: 'STATE_HIGHWAY',
          division: 'Ahmedabad R&B Division',
          overallCondition: 88,
          isUnderDlp: false,
          contractorName: 'Patel Engineering & Infrastructure Ltd.',
          tenderNumber: '',
          constructionCostLakhs: 850,
          imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&auto=format&fit=crop&q=80',
        })
        await loadAssets()
      }
    } catch (err) {
      alert(`Asset registration failed: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const filteredAssets = assets.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.division?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const canRegister = can('MANAGE_ASSETS') || activeRole.id === 'admin'

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Editorial Header with Official R&B Logo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd8] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#efe9de] border border-[#e6dfd8] flex items-center justify-center p-1.5 shadow-sm">
              <RnbLogo className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#141413]">R&B Master Asset Registry</h1>
              <p className="text-xs text-[#6c6a64]">
                Complete Inventory of State Highways, Bridges, Administrative Complexes & DLP Warranties
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-[#efe9de] p-0.5 rounded-lg border border-[#e6dfd8]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`h-7 px-2.5 text-xs ${viewMode === 'grid' ? 'bg-[#faf9f5] text-[#cc785c] shadow-sm font-semibold' : 'text-[#6c6a64]'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5 mr-1" /> Grid
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('table')}
              className={`h-7 px-2.5 text-xs ${viewMode === 'table' ? 'bg-[#faf9f5] text-[#cc785c] shadow-sm font-semibold' : 'text-[#6c6a64]'}`}
            >
              <List className="w-3.5 h-3.5 mr-1" /> Table
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadAssets}
            disabled={loading}
            className="bg-[#faf9f5] border-[#e6dfd8] hover:bg-[#efe9de] text-[#141413] text-xs h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Sync
          </Button>

          {canRegister && (
            <Button
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              className="bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs h-9"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Register Asset
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#6c6a64]" />
          <Input
            type="text"
            placeholder="Search by asset code, corridor name, or division..."
            className="pl-9 bg-[#faf9f5] border-[#e6dfd8] h-10 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-[#faf9f5] border-[#e6dfd8] h-10 text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-[#faf9f5] border-[#e6dfd8]">
              <SelectItem value="ALL">All Categories</SelectItem>
              <SelectItem value="ROAD">Roads & Corridors</SelectItem>
              <SelectItem value="BRIDGE">Bridges & Structures</SelectItem>
              <SelectItem value="FLYOVER">Flyovers & Overpasses</SelectItem>
              <SelectItem value="GOVERNMENT_BUILDING">Govt Buildings</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={dlpOnly ? 'default' : 'outline'}
            size="sm"
            className={
              dlpOnly
                ? 'h-10 bg-[#cc785c] text-white hover:bg-[#a9583e] text-xs'
                : 'h-10 bg-[#faf9f5] border-[#e6dfd8] text-[#141413] hover:bg-[#efe9de] text-xs'
            }
            onClick={() => setDlpOnly(!dlpOnly)}
          >
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            {dlpOnly ? 'DLP Protected Only' : 'Filter DLP'}
          </Button>
        </div>
      </div>

      {/* Grid View: High-Res Real Photo Cards */}
      {viewMode === 'grid' && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAssets.length === 0 ? (
            <div className="col-span-full bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-12 text-center text-[#6c6a64] text-sm">
              {loading ? 'Fetching assets from MongoDB...' : 'No assets found matching filters.'}
            </div>
          ) : (
            filteredAssets.map((asset) => (
              <div
                key={asset._id}
                onClick={() => {
                  setSelectedAsset(asset)
                  setIsDetailOpen(true)
                }}
                className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl overflow-hidden hover:border-[#cc785c]/50 transition-all shadow-sm cursor-pointer group flex flex-col"
              >
                {/* Image Banner */}
                <div className="relative h-48 w-full overflow-hidden bg-[#141413]">
                  <img
                    src={asset.imageUrl || 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1000&auto=format&fit=crop&q=80'}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#141413]/80 backdrop-blur-md text-[#cc785c] border border-white/10">
                      {asset.assetCode}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white/90 backdrop-blur-md text-[#141413]">
                      {asset.category}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between items-center text-xs bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded">
                    <span>PCI Condition: <strong className="text-[#5db872]">{asset.overallCondition}/100</strong></span>
                    {asset.dlp?.isUnderDLP ? (
                      <span className="text-[#5db872] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Under DLP
                      </span>
                    ) : (
                      <span className="text-[#a09d96]">Dept. Maintenance</span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#141413] leading-snug group-hover:text-[#cc785c] transition-colors">
                      {asset.name}
                    </h3>
                    <p className="text-xs text-[#6c6a64] mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#cc785c] flex-shrink-0" />
                      <span className="truncate">{asset.division}</span>
                    </p>
                  </div>

                  <div className="border-t border-[#e6dfd8] pt-3 text-xs text-[#6c6a64] space-y-1">
                    <div className="flex justify-between">
                      <span>Capital Cost:</span>
                      <strong className="text-[#141413]">₹{(asset.financials?.constructionCostLakhs / 100).toFixed(2)} Cr</strong>
                    </div>
                    {asset.dlp?.isUnderDLP && (
                      <div className="flex justify-between text-[11px]">
                        <span>Contractor:</span>
                        <span className="text-[#141413] font-medium truncate max-w-[170px]">{asset.dlp.contractorName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#faf9f5] text-[#6c6a64] text-xs uppercase tracking-wider border-b border-[#e6dfd8]">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Photo & Code</th>
                  <th className="px-5 py-3.5 font-medium">Asset Name</th>
                  <th className="px-5 py-3.5 font-medium">Category</th>
                  <th className="px-5 py-3.5 font-medium">Division</th>
                  <th className="px-5 py-3.5 font-medium">Condition (PCI)</th>
                  <th className="px-5 py-3.5 font-medium">Contractor / DLP</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dfd8] bg-[#faf9f5]">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[#6c6a64]">
                      {loading ? 'Fetching assets from MongoDB...' : 'No assets found matching filters.'}
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <tr
                      key={asset._id}
                      onClick={() => {
                        setSelectedAsset(asset)
                        setIsDetailOpen(true)
                      }}
                      className="hover:bg-[#efe9de]/50 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={asset.imageUrl || 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=200&auto=format&fit=crop&q=80'}
                            alt={asset.name}
                            className="w-12 h-10 rounded object-cover border border-[#e6dfd8] flex-shrink-0"
                          />
                          <span className="font-mono text-xs font-semibold text-[#cc785c]">
                            {asset.assetCode}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-[#141413]">
                        <div>{asset.name}</div>
                        <div className="text-xs text-[#6c6a64]">{asset.subType?.replace(/_/g, ' ')}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded bg-[#efe9de] text-[#141413] text-xs">
                          {asset.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#6c6a64]">
                        {asset.division}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-[#efe9de] rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                asset.overallCondition > 80
                                  ? 'bg-[#5db872]'
                                  : asset.overallCondition > 60
                                  ? 'bg-[#e8a55a]'
                                  : 'bg-[#c64545]'
                              }`}
                              style={{ width: `${asset.overallCondition}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs">{asset.overallCondition}/100</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs">
                        {asset.dlp?.isUnderDLP ? (
                          <div className="space-y-0.5">
                            <div className="font-medium text-[#5db872] flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> Under DLP
                            </div>
                            <div className="text-[#6c6a64] text-[11px] truncate max-w-[150px]">
                              {asset.dlp.contractorName}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[#6c6a64]">Dept. Maintained</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#cc785c] hover:bg-[#efe9de] text-xs h-8"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Asset Dossier Modal */}
      {selectedAsset && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-3xl bg-[#faf9f5] border border-[#e6dfd8] text-[#141413] p-6 max-h-[85vh] overflow-y-auto">
            <DialogHeader className="border-b border-[#e6dfd8] pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-semibold text-[#cc785c]">
                    {selectedAsset.assetCode}
                  </span>
                  <DialogTitle className="font-serif text-2xl text-[#141413] mt-1">
                    {selectedAsset.name}
                  </DialogTitle>
                </div>
                <Badge className="bg-[#efe9de] text-[#141413] border border-[#e6dfd8]">
                  PCI: {selectedAsset.overallCondition}/100
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* High-Res Photo Banner */}
              <div className="rounded-xl overflow-hidden border border-[#e6dfd8] bg-[#141413] max-h-72">
                <img
                  src={selectedAsset.imageUrl || 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&auto=format&fit=crop&q=80'}
                  alt={selectedAsset.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Asset Information Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#efe9de] p-3 rounded-lg border border-[#e6dfd8]">
                  <div className="text-[#6c6a64] text-[10px]">Division</div>
                  <div className="font-medium text-[#141413] mt-0.5">{selectedAsset.division}</div>
                </div>
                <div className="bg-[#efe9de] p-3 rounded-lg border border-[#e6dfd8]">
                  <div className="text-[#6c6a64] text-[10px]">Classification</div>
                  <div className="font-medium text-[#141413] mt-0.5">{selectedAsset.subType?.replace(/_/g, ' ')}</div>
                </div>
                <div className="bg-[#efe9de] p-3 rounded-lg border border-[#e6dfd8]">
                  <div className="text-[#6c6a64] text-[10px]">Capital Outlay</div>
                  <div className="font-medium text-[#cc785c] mt-0.5">₹{(selectedAsset.financials?.constructionCostLakhs / 100).toFixed(2)} Cr</div>
                </div>
                <div className="bg-[#efe9de] p-3 rounded-lg border border-[#e6dfd8]">
                  <div className="text-[#6c6a64] text-[10px]">Year Built</div>
                  <div className="font-medium text-[#141413] mt-0.5">{selectedAsset.financials?.yearBuilt || 2023}</div>
                </div>
              </div>

              {/* DLP Guarantee Card */}
              {selectedAsset.dlp?.isUnderDLP && (
                <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#141413]">
                    <span className="flex items-center gap-1.5 text-[#5db872]">
                      <ShieldCheck className="w-4 h-4" /> Contractor Defect Liability Guarantee Active
                    </span>
                    <Badge className="text-[10px] font-mono bg-[#faf9f5] text-[#5db872] border border-[#5db872]/30">
                      Tender {selectedAsset.dlp.tenderNumber}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#6c6a64]">
                    Contractor <strong className="text-[#141413]">{selectedAsset.dlp.contractorName}</strong> is bound to rectify all surface distresses at zero government expense until{' '}
                    <strong className="text-[#141413]">{selectedAsset.dlp.endDate ? new Date(selectedAsset.dlp.endDate).toLocaleDateString() : 'March 2027'}</strong>.
                  </p>
                </div>
              )}

              {/* Pavement Components */}
              {selectedAsset.segments?.[0]?.components?.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#141413] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#cc785c]" /> Structural Layer Breakdown
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2 text-xs">
                    {selectedAsset.segments[0].components.map((c, i) => (
                      <div key={i} className="bg-[#efe9de]/70 border border-[#e6dfd8] p-2.5 rounded-lg">
                        <div className="font-medium text-[#141413]">{c.name}</div>
                        <div className="text-[11px] text-[#6c6a64] mt-0.5">{c.material}</div>
                        <div className="text-[10px] font-mono text-[#5db872] mt-1">Score: {c.conditionScore}/100</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="border-t border-[#e6dfd8] pt-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailOpen(false)}
                className="bg-[#faf9f5] border-[#e6dfd8] text-xs h-9"
              >
                Close Dossier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Register Asset Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#faf9f5] border border-[#e6dfd8] text-[#141413] max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#141413]">Register Infrastructure Asset</DialogTitle>
            <DialogDescription className="text-xs text-[#6c6a64]">
              Enlist new highway, bridge, or government building into R&B State Database.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAsset} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Asset Name / Corridor Title</Label>
              <Input
                value={newAsset.name}
                onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                placeholder="e.g. Dholera SIR 8-Lane Smart Expressway"
                className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Category</Label>
                <Select
                  value={newAsset.category}
                  onValueChange={(val) => setNewAsset({ ...newAsset, category: val })}
                >
                  <SelectTrigger className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#faf9f5] border-[#e6dfd8]">
                    <SelectItem value="ROAD">Road / Highway</SelectItem>
                    <SelectItem value="BRIDGE">Bridge Structure</SelectItem>
                    <SelectItem value="FLYOVER">Flyover / Underpass</SelectItem>
                    <SelectItem value="GOVERNMENT_BUILDING">Govt Building</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Initial PCI Condition (0-100)</Label>
                <Input
                  type="number"
                  value={newAsset.overallCondition}
                  onChange={(e) => setNewAsset({ ...newAsset, overallCondition: e.target.value })}
                  className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Asset Photo URL (Real Internet Photo)</Label>
              <Input
                value={newAsset.imageUrl}
                onChange={(e) => setNewAsset({ ...newAsset, imageUrl: e.target.value })}
                className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Division</Label>
                <Input
                  value={newAsset.division}
                  onChange={(e) => setNewAsset({ ...newAsset, division: e.target.value })}
                  className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Cost (₹ Lakhs)</Label>
                <Input
                  type="number"
                  value={newAsset.constructionCostLakhs}
                  onChange={(e) => setNewAsset({ ...newAsset, constructionCostLakhs: e.target.value })}
                  className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="bg-[#faf9f5] border-[#e6dfd8] text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs h-9"
              >
                {saving ? 'Registering...' : 'Register Asset'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
