import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import {
  Search,
  Building2,
  AlertTriangle,
  HardHat,
  Map as MapIcon,
  ShieldCheck,
  Camera,
  FileText,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

export function QuickSearchModal({ isOpen, onOpenChange }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({
    assets: [],
    complaints: [],
    workOrders: [],
  })
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  // Quick navigation pages
  const QUICK_PAGES = [
    { title: 'Interactive GIS Corridor Map', path: '/map', icon: MapIcon, category: 'Navigation', tag: 'GIS' },
    { title: 'Report Road Defect (Camera/Gallery)', path: '/report', icon: Camera, category: 'Navigation', tag: 'Public' },
    { title: 'Start Certified Stage Inspection', path: '/inspections/new', icon: Camera, category: 'Navigation', tag: 'Field QA' },
    { title: 'AI Verification Desk & Forensics', path: '/verification', icon: ShieldCheck, category: 'Navigation', tag: 'AI' },
    { title: 'Contractor DLP Warranty Manager', path: '/defects', icon: ShieldCheck, category: 'Navigation', tag: 'Contracts' },
    { title: 'Forensic Audit Ledger', path: '/audit', icon: FileText, category: 'Navigation', tag: 'Ledger' },
  ]

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 80)
      fetchInitialData()
    }
  }, [isOpen])

  // Fetch initial cache from server
  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [assetsRes, complaintsRes, woRes] = await Promise.all([
        api.getAssets().catch(() => ({ data: [] })),
        api.getComplaints().catch(() => ({ data: [] })),
        api.getWorkOrders().catch(() => ({ data: [] })),
      ])

      setResults({
        assets: assetsRes.data || [],
        complaints: complaintsRes.data || [],
        workOrders: woRes.data || [],
      })
    } catch (err) {
      console.error('Search init error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter items matching query
  const q = query.trim().toLowerCase()

  const filteredAssets = results.assets.filter((a) =>
    !q || a.name?.toLowerCase().includes(q) || a.assetCode?.toLowerCase().includes(q) || a.division?.toLowerCase().includes(q)
  ).slice(0, 5)

  const filteredComplaints = results.complaints.filter((c) =>
    !q || c.title?.toLowerCase().includes(q) || c.ticketNumber?.toLowerCase().includes(q) || c.location?.address?.toLowerCase().includes(q)
  ).slice(0, 5)

  const filteredWorkOrders = results.workOrders.filter((w) =>
    !q || w.title?.toLowerCase().includes(q) || w.orderNumber?.toLowerCase().includes(q) || w.contractor?.name?.toLowerCase().includes(q)
  ).slice(0, 4)

  const filteredPages = QUICK_PAGES.filter((p) =>
    !q || p.title.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q)
  )

  const handleSelect = (path) => {
    onOpenChange(false)
    navigate(path)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#faf9f5] border border-[#e6dfd8] p-0 overflow-hidden text-[#141413] shadow-2xl">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-[#e6dfd8] bg-[#faf9f5]">
          <Search className="w-5 h-5 text-[#cc785c] mr-3 flex-shrink-0" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search state highways, bridge assets, complaint tickets, tenders..."
            className="h-14 border-0 focus-visible:ring-0 text-sm bg-transparent placeholder:text-[#6c6a64]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#6c6a64] hover:text-[#141413] px-2 py-1 bg-[#efe9de] rounded font-mono"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5 bg-[#faf9f5]">
          {/* Quick Pages */}
          {filteredPages.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#6c6a64] mb-2 px-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#cc785c]" /> Quick Nav & Workflows
              </div>
              <div className="grid sm:grid-cols-2 gap-1.5">
                {filteredPages.map((page) => {
                  const Icon = page.icon
                  return (
                    <div
                      key={page.path}
                      onClick={() => handleSelect(page.path)}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#efe9de]/60 hover:bg-[#efe9de] border border-[#e6dfd8] cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 text-[#cc785c] flex-shrink-0" />
                        <span className="text-xs font-medium text-[#141413] truncate">{page.title}</span>
                      </div>
                      <Badge className="text-[10px] bg-[#faf9f5] text-[#6c6a64] border border-[#e6dfd8] group-hover:border-[#cc785c]/40">
                        {page.tag}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Assets Section */}
          {filteredAssets.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#6c6a64] mb-2 px-2 flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-[#cc785c]" /> Infrastructure Assets ({filteredAssets.length})
              </div>
              <div className="space-y-1.5">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset._id}
                    onClick={() => handleSelect('/assets')}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#efe9de]/40 hover:bg-[#efe9de] border border-[#e6dfd8] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {asset.imageUrl ? (
                        <img
                          src={asset.imageUrl}
                          alt={asset.name}
                          className="w-9 h-9 rounded object-cover border border-[#e6dfd8] flex-shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded bg-[#efe9de] flex items-center justify-center flex-shrink-0 border border-[#e6dfd8]">
                          <Building2 className="w-4 h-4 text-[#cc785c]" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-[#141413] truncate">{asset.name}</div>
                        <div className="text-[11px] text-[#6c6a64] flex items-center gap-2">
                          <span className="font-mono text-[#cc785c]">{asset.assetCode}</span>
                          <span>•</span>
                          <span>{asset.category}</span>
                          <span>•</span>
                          <span className="text-[#5db872]">PCI {asset.overallCondition}/100</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6c6a64] group-hover:text-[#cc785c] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grievance Tickets Section */}
          {filteredComplaints.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#6c6a64] mb-2 px-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 text-[#e8a55a]" /> Grievances & AI Flagged Tickets ({filteredComplaints.length})
              </div>
              <div className="space-y-1.5">
                {filteredComplaints.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => handleSelect('/complaints')}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#efe9de]/40 hover:bg-[#efe9de] border border-[#e6dfd8] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {c.evidence?.imageUrl ? (
                        <img
                          src={c.evidence.imageUrl}
                          alt={c.title}
                          className="w-9 h-9 rounded object-cover border border-[#e6dfd8] flex-shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded bg-[#efe9de] flex items-center justify-center flex-shrink-0 border border-[#e6dfd8]">
                          <AlertTriangle className="w-4 h-4 text-[#cc785c]" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-[#141413] truncate">{c.title}</div>
                        <div className="text-[11px] text-[#6c6a64] flex items-center gap-2">
                          <span className="font-mono text-[#cc785c]">{c.ticketNumber}</span>
                          <span>•</span>
                          <span>{c.severity}</span>
                          <span>•</span>
                          <span className={c.evidence?.overallRiskScore >= 50 ? 'text-[#c64545] font-semibold' : 'text-[#5db872]'}>
                            Risk: {c.evidence?.overallRiskScore ?? 10}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6c6a64] group-hover:text-[#cc785c] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Orders Section */}
          {filteredWorkOrders.length > 0 && (
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#6c6a64] mb-2 px-2 flex items-center gap-1.5">
                <HardHat className="w-3 h-3 text-[#cc785c]" /> Active Tenders & Work Orders ({filteredWorkOrders.length})
              </div>
              <div className="space-y-1.5">
                {filteredWorkOrders.map((wo) => (
                  <div
                    key={wo._id}
                    onClick={() => handleSelect('/work-orders')}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#efe9de]/40 hover:bg-[#efe9de] border border-[#e6dfd8] cursor-pointer transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#141413] truncate">{wo.title}</div>
                      <div className="text-[11px] text-[#6c6a64] flex items-center gap-2">
                        <span className="font-mono text-[#cc785c]">{wo.orderNumber}</span>
                        <span>•</span>
                        <span>{wo.contractor?.name}</span>
                        <span>•</span>
                        <span className="text-[#141413] font-medium">₹{(wo.sanctionedAmountLakhs / 100).toFixed(2)} Cr</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6c6a64] group-hover:text-[#cc785c] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredAssets.length === 0 && filteredComplaints.length === 0 && filteredWorkOrders.length === 0 && filteredPages.length === 0 && (
            <div className="text-center py-8 text-[#6c6a64] text-xs">
              No matching assets, tickets, or work orders found for "{query}".
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-[#e6dfd8] bg-[#efe9de] flex items-center justify-between text-[11px] text-[#6c6a64]">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-[#faf9f5] border border-[#e6dfd8] rounded font-mono">ESC</kbd> to exit</span>
            <span><kbd className="px-1.5 py-0.5 bg-[#faf9f5] border border-[#e6dfd8] rounded font-mono">Ctrl+K</kbd> to toggle</span>
          </div>
          <span className="font-mono text-[10px] text-[#cc785c]">MongoDB Atlas Live Index</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QuickSearchModal
