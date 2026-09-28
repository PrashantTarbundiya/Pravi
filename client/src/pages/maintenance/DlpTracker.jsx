import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  Search,
  RefreshCw,
  Plus
} from 'lucide-react'

import { RnbLogo } from '@/components/RnbLogo'

export default function DlpTracker() {
  const [searchTerm, setSearchTerm] = useState('')
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)

  // Dialog State for Issuing Defect Notice
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [noticeData, setNoticeData] = useState({
    contractor: 'Patel Engineering & Infra Ltd.',
    corridor: 'SG Highway SH-24 KM 4+200',
    defectDescription: 'Severe rutting and pothole cluster on asphalt surface.',
    rectificationDays: 7,
  })

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await api.getAssets('underDlp=true')
      if (res.success) {
        setAssets(res.data)
      }
    } catch (err) {
      console.error('Failed to load DLP assets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleIssueNotice = (e) => {
    e.preventDefault()
    alert(`Legal Defect Rectification Notice served to ${noticeData.contractor} under R&B Clause 14. Rectification required within ${noticeData.rectificationDays} days at zero cost.`)
    setIsDialogOpen(false)
  }

  const filtered = assets.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.dlp?.contractorName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd8] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <RnbLogo className="w-8 h-8" />
            <h1 className="text-4xl font-serif text-[#141413]">Contractor Defect Liability (DLP) Manager</h1>
            <Badge className="bg-[#efe9de] text-[#5db872] border border-[#e6dfd8] text-xs font-mono">
              Zero-Cost Guarantee
            </Badge>
          </div>
          <p className="text-sm text-[#6c6a64] mt-1">
            Tracking 3 to 5-year contractor maintenance obligations, defect notices, and security bank guarantees
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="bg-[#faf9f5] border-[#e6dfd8] hover:bg-[#efe9de] text-[#141413] text-xs h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Sync
          </Button>
          <Button
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs h-9"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" /> Issue Notice to Contractor
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-1">
          <div className="text-xs text-[#6c6a64]">Protected by Bank Guarantee</div>
          <div className="text-3xl font-serif text-[#cc785c]">₹10.28 Crore</div>
          <p className="text-[11px] text-[#6c6a64]">Contractor deposit held against road failures</p>
        </div>

        <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-1">
          <div className="text-xs text-[#6c6a64]">Protected Assets Under DLP</div>
          <div className="text-3xl font-serif text-[#5db872]">{assets.length} Corridors</div>
          <p className="text-[11px] text-[#6c6a64]">Defects fixed by contractor with 0 government outlay</p>
        </div>

        <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-1">
          <div className="text-xs text-[#6c6a64]">Notice Rectification SLA</div>
          <div className="text-3xl font-serif text-[#141413]">7 Days</div>
          <p className="text-[11px] text-[#6c6a64]">Auto-forfeiture of bank guarantee if defaulted</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#e6dfd8] flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-[#6c6a64]" />
            <Input
              type="text"
              placeholder="Search by asset or contractor..."
              className="pl-9 bg-[#faf9f5] border-[#e6dfd8] h-10 text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#faf9f5] text-[#6c6a64] text-xs uppercase tracking-wider border-b border-[#e6dfd8]">
              <tr>
                <th className="px-6 py-3.5 font-medium">Asset Corridor</th>
                <th className="px-6 py-3.5 font-medium">Contractor / Tender</th>
                <th className="px-6 py-3.5 font-medium">DLP Expiry</th>
                <th className="px-6 py-3.5 font-medium">Condition (PCI)</th>
                <th className="px-6 py-3.5 font-medium">Status</th>
                <th className="px-6 py-3.5 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6dfd8] bg-[#faf9f5]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6c6a64]">
                    {loading ? 'Loading DLP warranty data...' : 'No DLP records found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-[#efe9de]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#141413]">{c.name}</div>
                      <div className="text-xs font-mono text-[#cc785c]">{c.assetCode}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-medium text-[#141413]">{c.dlp?.contractorName || 'Patel Engineering'}</div>
                      <div className="text-[#6c6a64]">{c.dlp?.tenderNumber || 'R&B/TN/2024/091'}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div>{c.dlp?.endDate ? new Date(c.dlp.endDate).toLocaleDateString() : 'March 2027'}</div>
                      <div className="text-[#5db872] font-medium">Active Warranty</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-[#5db872]">{c.overallCondition}/100</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded bg-[#5db872]/10 text-[#5db872] border border-[#5db872]/30 text-xs font-medium">
                        Guaranteed
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNoticeData({ ...noticeData, contractor: c.dlp?.contractorName || 'Contractor', corridor: c.name })
                          setIsDialogOpen(true)
                        }}
                        className="bg-[#faf9f5] border-[#e6dfd8] text-xs h-8"
                      >
                        Issue Notice
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog for Issuing Defect Notice */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#faf9f5] border border-[#e6dfd8] text-[#141413] max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#141413]">Issue Legal Defect Notice</DialogTitle>
            <DialogDescription className="text-xs text-[#6c6a64]">
              Mandate contractor rectification under Defect Liability Period obligations.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleIssueNotice} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Contractor</Label>
              <Input
                value={noticeData.contractor}
                onChange={(e) => setNoticeData({ ...noticeData, contractor: e.target.value })}
                className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Asset / Corridor Location</Label>
              <Input
                value={noticeData.corridor}
                onChange={(e) => setNoticeData({ ...noticeData, corridor: e.target.value })}
                className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Defect Observations & Rectification Scope</Label>
              <Input
                value={noticeData.defectDescription}
                onChange={(e) => setNoticeData({ ...noticeData, defectDescription: e.target.value })}
                className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Mandatory Rectification Days (SLA)</Label>
              <Input
                type="number"
                value={noticeData.rectificationDays}
                onChange={(e) => setNoticeData({ ...noticeData, rectificationDays: e.target.value })}
                className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs font-mono"
                required
              />
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
                className="bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs h-9"
              >
                Issue Notice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
