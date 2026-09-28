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
  HardHat,
  Plus,
  Search,
  Building2,
  Calendar,
  ShieldCheck,
  RefreshCw,
  ArrowUpRight
} from 'lucide-react'

import { RnbLogo } from '@/components/RnbLogo'
import { useRoleStore } from '@/stores/useRoleStore'

export default function ProjectList() {
  const { activeRole, can } = useRoleStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newProject, setNewProject] = useState({
    title: '',
    contractorName: 'Patel Engineering & Infra Ltd.',
    sanctionedAmountLakhs: 850,
    tenderAmountLakhs: 880,
    completionMonths: 18,
    dlpPeriodMonths: 36,
  })

  const loadProjects = async () => {
    try {
      setLoading(true)
      const res = await api.getWorkOrders()
      if (res.success) {
        setProjects(res.data)
      }
    } catch (err) {
      console.error('Failed to load projects:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!newProject.title.trim()) return alert('Please enter project title!')
    try {
      setSaving(true)
      const payload = {
        title: newProject.title,
        contractor: {
          name: newProject.contractorName,
          licenseClass: 'Special Class I',
          phone: '+91 98250 00000',
        },
        sanctionedAmountLakhs: Number(newProject.sanctionedAmountLakhs),
        tenderAmountLakhs: Number(newProject.tenderAmountLakhs),
        startDate: new Date(),
        completionDeadline: new Date(Date.now() + newProject.completionMonths * 30 * 24 * 60 * 60 * 1000),
        dlpPeriodMonths: Number(newProject.dlpPeriodMonths),
      }
      const res = await api.createWorkOrder(payload)
      if (res.success) {
        setIsDialogOpen(false)
        setNewProject({
          title: '',
          contractorName: 'Patel Engineering & Infra Ltd.',
          sanctionedAmountLakhs: 850,
          tenderAmountLakhs: 880,
          completionMonths: 18,
          dlpPeriodMonths: 36,
        })
        await loadProjects()
      }
    } catch (err) {
      alert(`Failed to sanction project: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contractor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const canSanction = can('SANCTION_TENDER') || activeRole.id === 'admin'

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfd8] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#efe9de] border border-[#e6dfd8] flex items-center justify-center p-1.5 shadow-sm">
              <RnbLogo className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#141413]">R&B Capital Projects & Contracts</h1>
              <p className="text-xs text-[#6c6a64]">
                Tracking execution milestones, physical progress, contractor liabilities, and payment gates
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadProjects}
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
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Sanction New Tender
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#6c6a64]" />
          <Input
            placeholder="Search by tender ID, corridor, or contractor..."
            className="pl-9 h-10 bg-[#faf9f5] border-[#e6dfd8] text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filtered.length === 0 ? (
          <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-12 text-center text-[#6c6a64] text-sm">
            {loading ? 'Fetching projects from Atlas DB...' : 'No sanctioned projects found.'}
          </div>
        ) : (
          filtered.map((p) => {
            const completedCount = p.milestones?.filter((m) => m.isPaid || m.progress === 100)?.length || 1
            const totalCount = p.milestones?.length || 3
            const progress = Math.round((completedCount / totalCount) * 100)

            return (
              <div
                key={p._id}
                className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 hover:border-[#cc785c]/40 transition-colors shadow-sm"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Real Project Photo Preview */}
                  <div className="w-full lg:w-48 h-36 rounded-lg overflow-hidden border border-[#e6dfd8] bg-[#141413] flex-shrink-0">
                    <img
                      src={p.imageUrl || 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&auto=format&fit=crop&q=80'}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#cc785c] px-2 py-0.5 rounded bg-[#faf9f5] border border-[#e6dfd8]">
                        {p.orderNumber}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[#faf9f5] border border-[#e6dfd8] font-medium text-[#141413]">
                        {p.status?.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[#faf9f5] border border-[#e6dfd8] text-[#5db872] font-medium">
                        DLP: {p.dlpPeriodMonths || 36} Months
                      </span>
                    </div>

                    <h3 className="text-2xl font-serif text-[#141413] leading-snug">{p.title}</h3>

                    <div className="flex flex-wrap items-center gap-5 text-xs text-[#6c6a64]">
                      <span>Contractor: <strong className="text-[#141413]">{p.contractor?.name}</strong></span>
                      <span>Sanctioned: <strong className="text-[#141413]">₹{(p.sanctionedAmountLakhs / 100).toFixed(2)} Cr</strong></span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#cc785c]" />
                        Deadline: {p.completionDeadline ? new Date(p.completionDeadline).toLocaleDateString() : 'Dec 2026'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#6c6a64]">Physical Completion Gate</span>
                        <span className="font-bold text-[#cc785c]">{progress}% Certified</span>
                      </div>
                      <div className="h-2 w-full bg-[#faf9f5] rounded-full overflow-hidden border border-[#e6dfd8]">
                        <div
                          className="h-full bg-[#cc785c] rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Milestone Gate Status */}
                  <div className="border-t lg:border-t-0 lg:border-l border-[#e6dfd8] lg:pl-6 pt-4 lg:pt-0 flex flex-col justify-between space-y-4 min-w-[220px]">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-[#6c6a64]">Photo Verified Milestones</div>
                      <div className="text-xl font-bold flex items-center gap-1.5 text-[#5db872]">
                        <ShieldCheck className="w-5 h-5" />
                        {completedCount} of {totalCount} Certified
                      </div>
                      <p className="text-[11px] text-[#6c6a64]">Stage bills verified against live camera checks</p>
                    </div>

                    <Button variant="outline" size="sm" className="w-full bg-[#faf9f5] border-[#e6dfd8] text-xs h-9">
                      View Tender Dossier <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Dialog for Sanctioning New Tender */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#faf9f5] border border-[#e6dfd8] text-[#141413] max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#141413]">Sanction New Capital Tender</DialogTitle>
            <DialogDescription className="text-xs text-[#6c6a64]">
              Create new construction contract with milestone payment verification gates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Tender / Project Title</Label>
              <Input
                placeholder="e.g. 4-Laning of Sanand-Viramgam State Highway"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Contractor Name</Label>
              <Input
                value={newProject.contractorName}
                onChange={(e) => setNewProject({ ...newProject, contractorName: e.target.value })}
                className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Sanctioned Amount (Lakhs)</Label>
                <Input
                  type="number"
                  value={newProject.sanctionedAmountLakhs}
                  onChange={(e) => setNewProject({ ...newProject, sanctionedAmountLakhs: e.target.value })}
                  className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Execution Months</Label>
                <Input
                  type="number"
                  value={newProject.completionMonths}
                  onChange={(e) => setNewProject({ ...newProject, completionMonths: e.target.value })}
                  className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">DLP Warranty (Months)</Label>
              <Input
                type="number"
                value={newProject.dlpPeriodMonths}
                onChange={(e) => setNewProject({ ...newProject, dlpPeriodMonths: e.target.value })}
                className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs font-mono"
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
                disabled={saving}
                className="bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs h-9"
              >
                {saving ? 'Creating...' : 'Sanction Tender'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
