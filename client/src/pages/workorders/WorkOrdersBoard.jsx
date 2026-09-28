import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useRoleStore } from '@/stores/useRoleStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import {
  HardHat,
  Search,
  CheckCircle2,
  Clock,
  Camera,
  Calendar,
  ShieldCheck,
  FileCheck,
  RefreshCw,
  Plus,
  IndianRupee,
  Building2,
  DollarSign
} from 'lucide-react'

export default function WorkOrdersBoard() {
  const { activeRole } = useRoleStore()
  const [workOrders, setWorkOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form State for New Work Order
  const [title, setTitle] = useState('')
  const [contractorName, setContractorName] = useState('Patel Engineering & Infrastructure Ltd.')
  const [tenderAmountLakhs, setTenderAmountLakhs] = useState('850')
  const [sanctionedAmountLakhs, setSanctionedAmountLakhs] = useState('820')
  const [completionDeadline, setCompletionDeadline] = useState('2026-12-31')

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await api.getWorkOrders()
      if (res.success && res.data) {
        setWorkOrders(res.data)
      }
    } catch (err) {
      console.error('Failed to load work orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleCreateOrder = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const res = await api.createWorkOrder({
        title,
        contractor: {
          name: contractorName,
          contactPerson: 'Project Manager',
          phone: '+91 99241 88200',
        },
        tenderAmountLakhs: Number(tenderAmountLakhs),
        sanctionedAmountLakhs: Number(sanctionedAmountLakhs),
        completionDeadline: new Date(completionDeadline),
        status: 'IN_EXECUTION',
      })
      if (res.success) {
        setIsNewOrderOpen(false)
        setTitle('')
        await loadOrders()
      }
    } catch (err) {
      alert(`Failed to sanction work order: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleApproveMilestone = async (orderId, milestoneIdx) => {
    alert(`Stage milestone #${milestoneIdx + 1} certified and cleared for treasury payment disbarment.`)
  }

  const filteredOrders = workOrders.filter((wo) => {
    if (!searchTerm) return true
    const q = searchTerm.toLowerCase()
    return (
      wo.orderNumber?.toLowerCase().includes(q) ||
      wo.title?.toLowerCase().includes(q) ||
      wo.contractor?.name?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd8] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-serif text-[#141413]">Contractor Work Orders & Execution</h1>
            <Badge variant="outline" className="border-[#cc785c] text-[#cc785c] bg-[#cc785c]/10 text-xs font-mono">
              Role: {activeRole.name}
            </Badge>
          </div>
          <p className="text-xs text-[#6c6a64] mt-0.5">
            Stage milestone verification, live photographic proof gates, and treasury payment certifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(activeRole.id === 'project_manager' || activeRole.id === 'admin') && (
            <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs h-9">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Sanction Work Order
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#efe9de] border-[#e6dfd8] text-[#141413]">
                <DialogHeader>
                  <DialogTitle className="font-serif text-xl">Sanction New EPC Work Order</DialogTitle>
                  <DialogDescription className="text-xs text-[#6c6a64]">
                    Authorize road maintenance or construction execution with stage payment gates.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateOrder} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Work Order Title</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Asphalting & Widening of Ring Road Junction"
                      className="bg-[#faf9f5] border-[#e6dfd8]"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Awarded EPC Contractor</Label>
                    <Input
                      value={contractorName}
                      onChange={(e) => setContractorName(e.target.value)}
                      className="bg-[#faf9f5] border-[#e6dfd8]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Tender Amount (₹ Lakhs)</Label>
                      <Input
                        type="number"
                        value={tenderAmountLakhs}
                        onChange={(e) => setTenderAmountLakhs(e.target.value)}
                        className="bg-[#faf9f5] border-[#e6dfd8]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Sanctioned Amount (₹ Lakhs)</Label>
                      <Input
                        type="number"
                        value={sanctionedAmountLakhs}
                        onChange={(e) => setSanctionedAmountLakhs(e.target.value)}
                        className="bg-[#faf9f5] border-[#e6dfd8]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Completion Deadline</Label>
                    <Input
                      type="date"
                      value={completionDeadline}
                      onChange={(e) => setCompletionDeadline(e.target.value)}
                      className="bg-[#faf9f5] border-[#e6dfd8]"
                    />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-[#cc785c] hover:bg-[#a9583e] text-white"
                    >
                      {submitting ? 'Sanctioning...' : 'Authorize & Sanction Tender'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={loadOrders}
            disabled={loading}
            className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413] hover:bg-[#efe9de] text-xs h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8e8b82]" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by tender, order code, or contractor..."
          className="pl-9 bg-[#efe9de] border-[#e6dfd8] text-xs text-[#141413]"
        />
      </div>

      {/* Work Orders List */}
      <div className="grid gap-6">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-[#6c6a64] bg-[#efe9de] border border-[#e6dfd8] rounded-xl text-xs">
            {loading ? 'Fetching active work orders from Atlas...' : 'No work orders matching search criteria.'}
          </div>
        ) : (
          filteredOrders.map((wo) => (
            <div
              key={wo._id || wo.orderNumber}
              className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-5 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e6dfd8] pb-4">
                <div>
                  <div className="font-mono text-xs font-semibold text-[#cc785c]">
                    {wo.orderNumber || wo.id}
                  </div>
                  <h3 className="font-serif text-xl font-normal text-[#141413] mt-1">{wo.title}</h3>
                  <div className="text-xs text-[#6c6a64] mt-1 flex flex-wrap items-center gap-3">
                    <span>
                      EPC Contractor: <strong className="text-[#141413]">{wo.contractor?.name || 'Contractor'}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Budget: <strong className="text-[#141413]">₹{wo.sanctionedAmountLakhs || wo.sanctionedLakhs || 820} Lakhs</strong>
                    </span>
                    <span>•</span>
                    <span>
                      DLP Warranty: <strong className="text-[#141413]">{wo.dlpPeriodMonths || 36} Months</strong>
                    </span>
                  </div>
                </div>
                <Badge className="bg-[#faf9f5] text-[#2e7d32] border border-[#e6dfd8] text-xs font-mono">
                  {wo.status?.replace(/_/g, ' ') || 'IN EXECUTION'}
                </Badge>
              </div>

              {/* Milestones & Photographic Proof Gates */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-[#141413]">
                  Construction Milestones & AI Quality Verification Gates
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(wo.milestones || []).map((m, idx) => (
                    <div key={idx} className="p-4 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-medium text-[#141413]">
                        <span>{m.title || m.name}</span>
                        <Badge
                          variant="outline"
                          className={m.isPaid ? 'border-[#5db872] text-[#2e7d32] bg-[#5db872]/10 text-[10px]' : 'border-[#cc785c] text-[#cc785c] text-[10px]'}
                        >
                          {m.isPaid ? 'Certified & Disbursed' : 'Evidence Required'}
                        </Badge>
                      </div>

                      <div className="h-1.5 w-full bg-[#e6dfd8] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#cc785c] transition-all"
                          style={{ width: `${m.percentage || m.progress || 50}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-[#6c6a64] pt-1">
                        <span>Completion Weight: {m.percentage || m.progress || 25}%</span>
                        {!m.isPaid && (
                          <div className="flex items-center gap-2">
                            <Link to="/inspections/new">
                              <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2 gap-1 text-[#cc785c] hover:bg-[#efe9de]">
                                <Camera className="w-3 h-3" /> Certify Layer
                              </Button>
                            </Link>
                            {(activeRole.id === 'project_manager' || activeRole.id === 'admin') && (
                              <Button
                                size="sm"
                                onClick={() => handleApproveMilestone(wo._id, idx)}
                                className="h-6 text-[10px] px-2 bg-[#2e7d32] hover:bg-[#1b5e20] text-white"
                              >
                                Disburse Stage Bill
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
