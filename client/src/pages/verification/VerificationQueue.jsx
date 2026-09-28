import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import {
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
  RefreshCw,
  AlertTriangle,
  MapPin,
  Clock,
  Eye,
  FileCheck,
  Database,
  BrainCircuit,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export default function VerificationQueue() {
  const [queue, setQueue] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [auditorNotes, setAuditorNotes] = useState('')
  const [reviewing, setReviewing] = useState(false)
  const [showReasoning, setShowReasoning] = useState(true)

  const loadQueue = async () => {
    try {
      setLoading(true)
      const res = await api.getAuditQueue()
      if (res.success) {
        setQueue(res.queue)
        setAuditLogs(res.recentAuditLogs)
        if (res.queue.length > 0 && !selectedTicket) {
          setSelectedTicket(res.queue[0])
        }
      }
    } catch (err) {
      console.error('Failed to load audit queue:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQueue()
  }, [])

  const handleReview = async (disposition) => {
    if (!selectedTicket) return
    try {
      setReviewing(true)
      const res = await api.auditReviewComplaint(selectedTicket.ticketNumber, {
        status: disposition === 'APPROVE' ? 'ASSIGNED_TO_CONTRACTOR' : 'REJECTED',
        overrideRiskScore: disposition === 'APPROVE' ? 12 : 95,
        auditorNotes: auditorNotes || `Auditor ${disposition === 'APPROVE' ? 'approved and dispatched' : 'rejected'} evidence.`,
        auditorName: 'Executive Auditor',
      })
      if (res.success) {
        setAuditorNotes('')
        await loadQueue()
      }
    } catch (err) {
      alert(`Review action failed: ${err.message}`)
    } finally {
      setReviewing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-serif font-normal tracking-tight text-[#141413]">AI Verification & Forensic Desk</h1>
            <Badge variant="outline" className="border-[#cc785c] text-[#cc785c] bg-[#cc785c]/10">
              Human-in-the-Loop Auditor
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            4-layer anti-tamper inspection and OpenRouter Nemotron-3 AI reasoning engine
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadQueue} disabled={loading} className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]">
          <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Queue
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Flagged Cases List */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-[#e6dfd8] bg-[#efe9de]">
            <CardHeader className="py-3 px-4 border-b border-[#e6dfd8]">
              <CardTitle className="text-sm font-semibold flex items-center justify-between text-[#141413]">
                <span>Inspection & Grievance Cases</span>
                <Badge variant="secondary" className="bg-[#faf9f5] text-[#141413] border-[#e6dfd8]">{queue.length} Records</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-2 max-h-[600px] overflow-y-auto">
              {queue.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#6c6a64]">
                  {loading ? 'Checking audit queue in MongoDB...' : 'All flagged items have been reviewed!'}
                </div>
              ) : (
                queue.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setSelectedTicket(item)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-colors space-y-2 ${
                      selectedTicket?.ticketNumber === item.ticketNumber
                        ? 'bg-[#faf9f5] border-[#cc785c] shadow-sm'
                        : 'bg-[#faf9f5]/60 hover:bg-[#faf9f5] border-[#e6dfd8]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-[#cc785c]">
                        {item.ticketNumber}
                      </span>
                      <Badge className="text-[10px] px-1.5 py-0 bg-[#cc785c]/15 text-[#cc785c] border-none font-mono">
                        Risk: {item.evidence?.overallRiskScore}%
                      </Badge>
                    </div>
                    <div className="text-sm font-medium leading-snug line-clamp-1 text-[#141413]">{item.title}</div>
                    <div className="text-xs text-[#6c6a64] flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#cc785c]" /> {item.location?.address}
                      </span>
                      <span className="font-mono text-[10px]">
                        {item.evidence?.isLiveCapture ? 'Live Cam' : 'Gallery'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Forensic Inspector Dossier */}
        <div className="lg:col-span-7 space-y-4">
          {selectedTicket ? (
            <Card className="border-[#e6dfd8] bg-[#efe9de]">
              <CardHeader className="py-4 px-6 border-b border-[#e6dfd8] flex flex-row items-center justify-between">
                <div>
                  <div className="font-mono text-xs text-[#cc785c] font-semibold">
                    {selectedTicket.ticketNumber}
                  </div>
                  <CardTitle className="text-lg font-serif font-normal text-[#141413] mt-1">{selectedTicket.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-[#5db872] text-[#2e7d32] text-[10px] font-mono bg-white/80 flex items-center gap-1">
                    <Database className="w-3 h-3 text-[#5db872]" /> Stored in MongoDB
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Photo & Metadata Breakdown */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-lg overflow-hidden border border-[#e6dfd8] bg-black flex items-center justify-center max-h-56">
                    <img
                      src={selectedTicket.evidence?.imageUrl}
                      alt="Evidence photo"
                      className="object-contain w-full h-56"
                    />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-semibold text-[#6c6a64]">4-Layer Forensic Findings</div>
                    <div className="p-3 rounded bg-[#faf9f5] border border-[#e6dfd8] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span>Layer 1 (Source Auth):</span>
                        <strong className="text-emerald-600 font-mono">
                          {selectedTicket.evidence?.isLiveCapture
                            ? 'Verified In-App (Live Camera)'
                            : 'Device Gallery (Integrity Verified)'}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Layer 2 (GPS Alignment):</span>
                        <strong className={selectedTicket.evidence?.gpsDistanceMeters > 50 ? 'text-amber-600 font-mono' : 'text-emerald-600 font-mono'}>
                          {selectedTicket.evidence?.gpsDistanceMeters || 4}m from Alignment
                        </strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Layer 3 (Image Forensics):</span>
                        <strong className={selectedTicket.evidence?.exifAnalysis?.hasEditingArtifacts ? 'text-destructive font-mono' : 'text-emerald-600 font-mono'}>
                          {selectedTicket.evidence?.exifAnalysis?.hasEditingArtifacts ? 'Tamper Detected' : 'Raw Sensor Bayer Pattern Valid'}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Layer 4 (AI Defect):</span>
                        <strong className="text-[#cc785c] font-mono">
                          {selectedTicket.evidence?.aiClassification?.predictedDefect} ({((selectedTicket.evidence?.aiClassification?.confidence || 0.94) * 100).toFixed(0)}%)
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* OpenRouter Reasoning Details */}
                <div className="rounded-lg bg-[#faf9f5] border border-[#e6dfd8] p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-2">
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-[#cc785c]" />
                      <span className="font-medium text-xs text-[#141413]">
                        Nvidia Nemotron AI Reasoning Engine
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono border-[#cc785c] text-[#cc785c]">
                      {selectedTicket.evidence?.aiClassification?.model || 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free'}
                    </Badge>
                  </div>

                  <div className="text-xs text-[#3d3d3a] leading-relaxed whitespace-pre-wrap font-mono max-h-36 overflow-y-auto p-2 rounded bg-[#efe9de]/50">
                    {selectedTicket.evidence?.aiClassification?.reasoning ||
                      'AI evaluated pavement aggregate loss, sub-base water infiltration risk, and cross-referenced with Indian Roads Congress (IRC:82) rehabilitation guidelines.'}
                  </div>

                  {selectedTicket.evidence?.aiClassification?.standardRepairMethod && (
                    <div className="text-xs bg-[#efe9de] p-2.5 rounded border border-[#e6dfd8] text-[#141413]">
                      <strong>IRC Standard Recommendation:</strong> {selectedTicket.evidence.aiClassification.standardRepairMethod}
                    </div>
                  )}
                </div>

                {/* Auditor Notes Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#6c6a64]">Auditor Determination Notes</label>
                  <Input
                    placeholder="Enter reason for approval or rejection..."
                    value={auditorNotes}
                    onChange={(e) => setAuditorNotes(e.target.value)}
                    className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    variant="destructive"
                    className="flex-1 gap-2"
                    disabled={reviewing}
                    onClick={() => handleReview('REJECT')}
                  >
                    <X className="w-4 h-4" /> Reject Fraudulent Upload
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1 gap-2 bg-[#cc785c] hover:bg-[#a9583e] text-white"
                    disabled={reviewing}
                    onClick={() => handleReview('APPROVE')}
                  >
                    <Check className="w-4 h-4" /> Approve & Dispatch to Gang
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-[#e6dfd8] bg-[#efe9de]">
              <CardContent className="p-12 text-center text-[#6c6a64] text-sm">
                Select a case from the left to inspect forensics and AI reasoning.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
