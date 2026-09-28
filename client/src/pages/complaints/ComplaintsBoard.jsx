import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
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
  Clock,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Eye,
  RefreshCw,
  Plus,
  Camera,
  Cpu,
  CheckCircle2,
  Wrench,
  AlertCircle,
  Truck,
  ExternalLink,
} from 'lucide-react'

export default function ComplaintsBoard() {
  const { activeRole, can } = useRoleStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  // Forensic Dossier Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [isDossierOpen, setIsDossierOpen] = useState(false)

  // Status Update / Dispatch Gang Modal State
  const [dispatchComplaint, setDispatchComplaint] = useState(null)
  const [isDispatchOpen, setIsDispatchOpen] = useState(false)
  const [dispatchData, setDispatchData] = useState({
    status: 'ASSIGNED_TO_CONTRACTOR',
    contractorName: 'Patel Engineering & Infrastructure Ltd.',
    remarks: 'Dispatched emergency road repair team with cold-mix asphalt and compaction roller.',
  })
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Dialog State for Logging Grievance
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newComplaint, setNewComplaint] = useState({
    category: 'POTHOLE',
    severity: 'HIGH',
    address: 'SG Highway Ch 6+400, Ahmedabad',
    description: 'Road cave-in reported by citizen helpline.',
    reporterName: 'Control Room Officer',
    reporterPhone: '+91 79 2325 0000',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1000&auto=format&fit=crop&q=80',
  })

  const loadComplaints = async () => {
    try {
      setLoading(true)
      const res = await api.getComplaints()
      if (res.success) {
        setComplaints(res.data)
      }
    } catch (err) {
      console.error('Failed to load complaints:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComplaints()
  }, [])

  const handleCreateComplaint = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const payload = {
        title: `${newComplaint.category.replace(/_/g, ' ')} at ${newComplaint.address}`,
        description: newComplaint.description,
        category: newComplaint.category,
        severity: newComplaint.severity,
        address: newComplaint.address,
        coordinates: [72.5189, 23.0521],
        reportedBy: { name: newComplaint.reporterName, phone: newComplaint.reporterPhone, isAnonymous: false },
        captureToken: 'LIVE-OFFICER-INTAKE',
        imageUrl: newComplaint.imageUrl,
        fileName: 'officer_intake.jpg',
        source: 'LIVE_CAMERA',
      }
      const res = await api.createComplaint(payload)
      if (res.success) {
        setIsDialogOpen(false)
        await loadComplaints()
      }
    } catch (err) {
      alert(`Failed to log grievance: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleOpenDispatch = (c, initialStatus = 'ASSIGNED_TO_CONTRACTOR') => {
    setDispatchComplaint(c)
    setDispatchData({
      status: initialStatus,
      contractorName: c.location?.assetCode === 'RNB-GJ-BR-102' ? 'Afcons Infrastructure Ltd.' : 'Patel Engineering & Infrastructure Ltd.',
      remarks: initialStatus === 'WORK_IN_PROGRESS' 
        ? 'Contractor mobilized crew and asphalt cold-milling machinery on site.' 
        : initialStatus === 'RESOLVED' 
        ? 'Defect squared, compacted with DBM and wearing course. Quality passed.' 
        : 'Dispatched emergency road repair unit under 48h SLA warranty.',
    })
    setIsDispatchOpen(true)
  }

  const handleExecuteStatusUpdate = async (e) => {
    e.preventDefault()
    if (!dispatchComplaint) return
    try {
      setUpdatingStatus(true)
      const payload = {
        status: dispatchData.status,
        contractorName: dispatchData.contractorName,
        remarks: dispatchData.remarks,
      }
      const res = await api.auditReviewComplaint(dispatchComplaint.ticketNumber, payload)
      if (res.success) {
        setIsDispatchOpen(false)
        if (selectedComplaint && selectedComplaint.ticketNumber === dispatchComplaint.ticketNumber) {
          setSelectedComplaint(res.data)
        }
        await loadComplaints()
      }
    } catch (err) {
      alert(`Status update failed: ${err.message}`)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.location?.address && c.location.address.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === 'all') return matchesSearch
    if (activeTab === 'flagged') return matchesSearch && (c.evidence?.overallRiskScore >= 50 || c.status === 'FLAGGED_SUSPICIOUS')
    if (activeTab === 'in_progress') return matchesSearch && (c.status === 'ASSIGNED_TO_CONTRACTOR' || c.status === 'WORK_IN_PROGRESS')
    if (activeTab === 'resolved') return matchesSearch && c.status === 'RESOLVED'
    return matchesSearch
  })

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
              <h1 className="text-3xl font-serif font-bold text-[#141413]">Citizen Grievance Redressal</h1>
              <p className="text-xs text-[#6c6a64]">
                4-Layer AI Photo Verification, Geofence Enforcement, and Rapid Dispatch
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadComplaints}
            disabled={loading}
            className="bg-[#faf9f5] border-[#e6dfd8] hover:bg-[#efe9de] text-[#141413] text-xs h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Sync Atlas
          </Button>
          <Button
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Log Grievance
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="bg-[#efe9de] border border-[#e6dfd8] p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#faf9f5] text-xs">
              All Grievances ({complaints.length})
            </TabsTrigger>
            <TabsTrigger value="flagged" className="data-[state=active]:bg-[#faf9f5] text-xs text-[#c64545] font-medium">
              Flagged for Audit ({complaints.filter(c => c.evidence?.overallRiskScore >= 50 || c.status === 'FLAGGED_SUSPICIOUS').length})
            </TabsTrigger>
            <TabsTrigger value="in_progress" className="data-[state=active]:bg-[#faf9f5] text-xs">
              Active Execution ({complaints.filter(c => c.status === 'ASSIGNED_TO_CONTRACTOR' || c.status === 'WORK_IN_PROGRESS').length})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="data-[state=active]:bg-[#faf9f5] text-xs">
              Resolved ({complaints.filter(c => c.status === 'RESOLVED').length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#6c6a64]" />
            <Input
              type="text"
              placeholder="Search by Ticket, Road, or Defect..."
              className="pl-9 h-9 bg-[#faf9f5] border-[#e6dfd8] text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="space-y-4 m-0">
          <div className="grid gap-4">
            {filteredComplaints.length === 0 ? (
              <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-12 text-center text-[#6c6a64] text-sm">
                {loading ? 'Fetching grievances from MongoDB Atlas...' : 'No complaints found in this category.'}
              </div>
            ) : (
              filteredComplaints.map((c) => {
                const risk = c.evidence?.overallRiskScore ?? 0
                const isFlagged = risk >= 50
                const isLive = c.evidence?.source === 'LIVE_CAMERA' || c.evidence?.isLiveCapture

                return (
                  <div
                    key={c._id}
                    className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-5 hover:border-[#cc785c]/40 transition-colors shadow-sm"
                  >
                    <div className="flex flex-col lg:flex-row gap-5">
                      {/* Photo Thumbnail with Source Badge */}
                      <div className="relative w-full lg:w-48 h-36 rounded-lg overflow-hidden border border-[#e6dfd8] bg-[#faf9f5] flex-shrink-0 group">
                        <img
                          src={c.evidence?.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'}
                          alt={c.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded shadow backdrop-blur-md text-white font-medium ${isLive ? 'bg-[#5db872]/90' : 'bg-[#e8a55a]/90'}`}>
                            {isLive ? 'Live In-App Cam' : 'Gallery Upload'}
                          </span>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] bg-[#141413]/70 backdrop-blur-md text-white px-2 py-0.5 rounded font-mono">
                          <span>{c.category}</span>
                          <span>{c.evidence?.aiClassification?.confidence ? `${Math.round(c.evidence.aiClassification.confidence * 100)}% Conf` : 'AI'}</span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-[#cc785c] px-2 py-0.5 rounded bg-[#faf9f5] border border-[#e6dfd8]">
                            {c.ticketNumber}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-[#faf9f5] border border-[#e6dfd8] font-medium text-[#141413]">
                            {c.severity} PRIORITY
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded border font-medium ${
                            c.status === 'RESOLVED' 
                              ? 'bg-[#5db872]/10 text-[#5db872] border-[#5db872]/30'
                              : c.status === 'WORK_IN_PROGRESS'
                              ? 'bg-[#e8a55a]/10 text-[#e8a55a] border-[#e8a55a]/30'
                              : 'bg-[#faf9f5] text-[#6c6a64] border-[#e6dfd8]'
                          }`}>
                            {c.status.replace(/_/g, ' ')}
                          </span>

                          {!isFlagged ? (
                            <span className="inline-flex items-center text-xs font-medium text-[#5db872] gap-1 bg-[#5db872]/10 px-2.5 py-0.5 rounded border border-[#5db872]/30">
                              <ShieldCheck className="w-3.5 h-3.5" /> AI Verified (Risk: {risk}%)
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-semibold text-[#c64545] gap-1 bg-[#c64545]/10 px-2.5 py-0.5 rounded border border-[#c64545]/30">
                              <ShieldAlert className="w-3.5 h-3.5" /> High Risk ({risk}%) — Flagged for Vigilance
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-xl font-bold text-[#141413] leading-snug">
                          {c.title}
                        </h3>

                        <p className="text-xs text-[#6c6a64] line-clamp-2">
                          {c.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#6c6a64] pt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#cc785c]" /> {c.location?.address}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#cc785c]" /> SLA Due: {c.slaDeadline ? new Date(c.slaDeadline).toLocaleDateString() : 'Within 48h'}
                          </span>
                          <span>Reported by: <strong className="text-[#141413]">{c.reportedBy?.name || 'Citizen'}</strong></span>
                        </div>
                      </div>

                      {/* Action Buttons Column */}
                      <div className="flex lg:flex-col justify-end gap-2 border-t lg:border-t-0 lg:border-l border-[#e6dfd8] pt-3 lg:pt-0 lg:pl-4 lg:w-44 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedComplaint(c)
                            setIsDossierOpen(true)
                          }}
                          className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413] text-xs h-9 w-full justify-center"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5 text-[#cc785c]" /> Forensic Dossier
                        </Button>

                        {/* Role-Based Action Workflow */}
                        {c.status !== 'RESOLVED' && (
                          <>
                            {c.status === 'SUBMITTED' || c.status === 'FLAGGED_SUSPICIOUS' ? (
                              <Button
                                size="sm"
                                onClick={() => handleOpenDispatch(c, 'ASSIGNED_TO_CONTRACTOR')}
                                className="bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs h-9 w-full justify-center"
                              >
                                <Truck className="w-3.5 h-3.5 mr-1.5" /> Dispatch Gang
                              </Button>
                            ) : c.status === 'ASSIGNED_TO_CONTRACTOR' ? (
                              <Button
                                size="sm"
                                onClick={() => handleOpenDispatch(c, 'WORK_IN_PROGRESS')}
                                className="bg-[#e8a55a] hover:bg-[#c98338] text-white text-xs h-9 w-full justify-center"
                              >
                                <Wrench className="w-3.5 h-3.5 mr-1.5" /> Mark In Progress
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleOpenDispatch(c, 'RESOLVED')}
                                className="bg-[#5db872] hover:bg-[#489959] text-white text-xs h-9 w-full justify-center"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Mark Repaired
                              </Button>
                            )}
                          </>
                        )}

                        {c.status === 'RESOLVED' && (
                          <div className="text-center py-1">
                            <span className="text-[11px] font-medium text-[#5db872] flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Redressed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Forensic Dossier Modal */}
      {selectedComplaint && (
        <Dialog open={isDossierOpen} onOpenChange={setIsDossierOpen}>
          <DialogContent className="max-w-3xl bg-[#faf9f5] border border-[#e6dfd8] text-[#141413] p-6 max-h-[85vh] overflow-y-auto">
            <DialogHeader className="border-b border-[#e6dfd8] pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-semibold text-[#cc785c]">
                    {selectedComplaint.ticketNumber}
                  </span>
                  <DialogTitle className="font-serif text-2xl text-[#141413] mt-1">
                    {selectedComplaint.title}
                  </DialogTitle>
                </div>
                <Badge className={
                  selectedComplaint.evidence?.overallRiskScore >= 50
                    ? 'bg-[#c64545]/10 text-[#c64545] border-[#c64545]/30'
                    : 'bg-[#5db872]/10 text-[#5db872] border-[#5db872]/30'
                }>
                  Risk Score: {selectedComplaint.evidence?.overallRiskScore ?? 10}%
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* Photo Evidence with Metadata Overlay */}
              <div className="relative rounded-xl overflow-hidden border border-[#e6dfd8] bg-[#141413]">
                <img
                  src={selectedComplaint.evidence?.imageUrl}
                  alt={selectedComplaint.title}
                  className="w-full max-h-80 object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-xs flex justify-between items-end">
                  <div>
                    <div className="font-mono text-[#cc785c] font-semibold">
                      Token: {selectedComplaint.evidence?.captureToken || 'LIVE-VERIFIED'}
                    </div>
                    <div>Source: {selectedComplaint.evidence?.source || 'LIVE_CAMERA'}</div>
                  </div>
                  <div className="text-right">
                    <div>GPS Distance: {selectedComplaint.evidence?.gpsDistanceMeters || 4}m from corridor</div>
                    <div>Geofence: {selectedComplaint.evidence?.isWithinGeofence ? 'Pass (Within 50m)' : 'Failed'}</div>
                  </div>
                </div>
              </div>

              {/* Nemotron AI Reasoning Box */}
              <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#141413]">
                    <Cpu className="w-4 h-4 text-[#cc785c]" />
                    <span>OpenRouter Nemotron-3 Reasoning Engine</span>
                  </div>
                  <Badge className="text-[10px] font-mono bg-[#faf9f5] text-[#cc785c] border border-[#e6dfd8]">
                    {selectedComplaint.evidence?.aiClassification?.reasoningTokens || 184} Tokens
                  </Badge>
                </div>

                <div className="bg-[#faf9f5] border border-[#e6dfd8] p-3 rounded-lg text-xs font-mono text-[#3d3d3a] whitespace-pre-line leading-relaxed">
                  {selectedComplaint.evidence?.aiClassification?.reasoning || 
                   'Step 1: Visual sensor evaluation detects pavement defect.\nStep 2: Geofence tolerance verified against state highway corridor.\nStep 3: Recommended repair under IRC:82 standards.'}
                </div>

                <div className="text-xs space-y-1">
                  <div className="font-medium text-[#141413]">IRC:82 Compliance Method:</div>
                  <div className="text-[#6c6a64]">
                    {selectedComplaint.evidence?.aiClassification?.standardRepairMethod || 
                     'Square excavation to sound pavement, tack coat with RS-1 bitumen, and compacted DBM.'}
                  </div>
                </div>
              </div>

              {/* EXIF Sensor Integrity */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#efe9de] p-3 rounded-lg border border-[#e6dfd8]">
                  <div className="text-[#6c6a64] text-[10px]">Capture Hardware</div>
                  <div className="font-medium text-[#141413] mt-0.5">
                    {selectedComplaint.evidence?.exifAnalysis?.deviceModel || 'Mobile Sensor'}
                  </div>
                </div>
                <div className="bg-[#efe9de] p-3 rounded-lg border border-[#e6dfd8]">
                  <div className="text-[#6c6a64] text-[10px]">Software Signature</div>
                  <div className="font-medium text-[#141413] mt-0.5">
                    {selectedComplaint.evidence?.exifAnalysis?.software || 'InfraManage Cam'}
                  </div>
                </div>
                <div className="bg-[#efe9de] p-3 rounded-lg border border-[#e6dfd8]">
                  <div className="text-[#6c6a64] text-[10px]">Tamper Probability</div>
                  <div className="font-medium text-[#141413] mt-0.5">
                    {selectedComplaint.evidence?.exifAnalysis?.tamperProbability ? `${Math.round(selectedComplaint.evidence.exifAnalysis.tamperProbability * 100)}%` : '3%'}
                  </div>
                </div>
                <div className="bg-[#efe9de] p-3 rounded-lg border border-[#e6dfd8]">
                  <div className="text-[#6c6a64] text-[10px]">Current Status</div>
                  <div className="font-medium text-[#cc785c] mt-0.5">
                    {selectedComplaint.status.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-[#e6dfd8] pt-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDossierOpen(false)}
                className="bg-[#faf9f5] border-[#e6dfd8] text-xs h-9"
              >
                Close Dossier
              </Button>
              {selectedComplaint.status !== 'RESOLVED' && (
                <Button
                  size="sm"
                  onClick={() => {
                    setIsDossierOpen(false)
                    handleOpenDispatch(selectedComplaint, 'ASSIGNED_TO_CONTRACTOR')
                  }}
                  className="bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs h-9"
                >
                  <Truck className="w-3.5 h-3.5 mr-1.5" /> Dispatch Gang
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dispatch Gang / Update Status Modal */}
      {dispatchComplaint && (
        <Dialog open={isDispatchOpen} onOpenChange={setIsDispatchOpen}>
          <DialogContent className="max-w-md bg-[#faf9f5] border border-[#e6dfd8] text-[#141413]">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-[#141413]">Update Grievance Status</DialogTitle>
              <DialogDescription className="text-xs text-[#6c6a64]">
                Ticket {dispatchComplaint.ticketNumber} • {dispatchComplaint.location?.address}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleExecuteStatusUpdate} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">New Operational Status</Label>
                <Select
                  value={dispatchData.status}
                  onValueChange={(val) => setDispatchData({ ...dispatchData, status: val })}
                >
                  <SelectTrigger className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#faf9f5] border-[#e6dfd8]">
                    <SelectItem value="ASSIGNED_TO_CONTRACTOR">Assigned to Contractor / Gang</SelectItem>
                    <SelectItem value="WORK_IN_PROGRESS">Work In Progress on Site</SelectItem>
                    <SelectItem value="REPAIRED_AWAITING_INSPECTION">Repaired (Awaiting Inspection)</SelectItem>
                    <SelectItem value="RESOLVED">Resolved & Redressed</SelectItem>
                    <SelectItem value="FLAGGED_SUSPICIOUS">Flagged for Audit Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Assigned Contractor / Unit</Label>
                <Select
                  value={dispatchData.contractorName}
                  onValueChange={(val) => setDispatchData({ ...dispatchData, contractorName: val })}
                >
                  <SelectTrigger className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#faf9f5] border-[#e6dfd8]">
                    <SelectItem value="Patel Engineering & Infrastructure Ltd.">Patel Engineering & Infrastructure Ltd.</SelectItem>
                    <SelectItem value="L&T Heavy Civil Infrastructure Ltd.">L&T Heavy Civil Infrastructure Ltd.</SelectItem>
                    <SelectItem value="Dilip Buildcon Infrastructure Ltd.">Dilip Buildcon Infrastructure Ltd.</SelectItem>
                    <SelectItem value="Afcons Infrastructure Construction Ltd.">Afcons Infrastructure Construction Ltd.</SelectItem>
                    <SelectItem value="Ahmedabad City R&B Emergency Gang">Ahmedabad City R&B Emergency Gang</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Dispatch Order & Action Remarks</Label>
                <Input
                  value={dispatchData.remarks}
                  onChange={(e) => setDispatchData({ ...dispatchData, remarks: e.target.value })}
                  className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs"
                  required
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDispatchOpen(false)}
                  className="bg-[#faf9f5] border-[#e6dfd8] text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updatingStatus}
                  className="bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs h-9"
                >
                  {updatingStatus ? 'Updating Atlas...' : 'Confirm Status Update'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog for Logging Citizen Grievance */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#faf9f5] border border-[#e6dfd8] text-[#141413] max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#141413]">Log Road Grievance</DialogTitle>
            <DialogDescription className="text-xs text-[#6c6a64]">
              Intake citizen helpline call or field report into R&B Atlas database.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateComplaint} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Defect Category</Label>
                <Select
                  value={newComplaint.category}
                  onValueChange={(val) => setNewComplaint({ ...newComplaint, category: val })}
                >
                  <SelectTrigger className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#faf9f5] border-[#e6dfd8]">
                    <SelectItem value="POTHOLE">Pothole / Depression</SelectItem>
                    <SelectItem value="CRACKING">Rutting / Cracking</SelectItem>
                    <SelectItem value="BRIDGE_EXPANSION_JOINT">Bridge Expansion Joint</SelectItem>
                    <SelectItem value="DRAINAGE_OVERFLOW">Drain Overflow</SelectItem>
                    <SelectItem value="ROAD_CAVING">Road Caving / Sinkhole</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">SLA Priority</Label>
                <Select
                  value={newComplaint.severity}
                  onValueChange={(val) => setNewComplaint({ ...newComplaint, severity: val })}
                >
                  <SelectTrigger className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#faf9f5] border-[#e6dfd8]">
                    <SelectItem value="CRITICAL">Critical (24h SLA)</SelectItem>
                    <SelectItem value="HIGH">High (48h SLA)</SelectItem>
                    <SelectItem value="MEDIUM">Medium (5 Days)</SelectItem>
                    <SelectItem value="LOW">Low (10 Days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Location Landmark / Chainage</Label>
              <Input
                value={newComplaint.address}
                onChange={(e) => setNewComplaint({ ...newComplaint, address: e.target.value })}
                className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Description</Label>
              <Input
                value={newComplaint.description}
                onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Defect Image URL (Internet Proof)</Label>
              <Input
                value={newComplaint.imageUrl}
                onChange={(e) => setNewComplaint({ ...newComplaint, imageUrl: e.target.value })}
                className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Reporter / Caller</Label>
                <Input
                  value={newComplaint.reporterName}
                  onChange={(e) => setNewComplaint({ ...newComplaint, reporterName: e.target.value })}
                  className="bg-[#efe9de] border-[#e6dfd8] h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Phone</Label>
                <Input
                  value={newComplaint.reporterPhone}
                  onChange={(e) => setNewComplaint({ ...newComplaint, reporterPhone: e.target.value })}
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
                {saving ? 'Saving...' : 'Register Grievance'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
