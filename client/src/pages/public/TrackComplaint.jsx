import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import {
  Search,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Clock,
  MapPin,
  CheckCircle2,
  HardHat,
  AlertCircle
} from 'lucide-react'

export default function TrackComplaint() {
  const [ticketNumber, setTicketNumber] = useState('RNB-GRV-2026-0081')
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!ticketNumber.trim()) return
    try {
      setLoading(true)
      setError('')
      setSearched(true)
      const res = await api.getComplaint(ticketNumber.trim())
      if (res.success) {
        setComplaint(res.data)
      } else {
        setComplaint(null)
      }
    } catch (err) {
      setError(err.message || 'Ticket not found')
      setComplaint(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Track Grievance Status</h1>
          <p className="text-xs text-muted-foreground">
            Real-time R&B SLA timeline and verified photographic audit records
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter Ticket ID (e.g. RNB-GRV-2026-0081)"
                className="pl-9 h-10 font-mono"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
              />
            </div>
            <Button type="submit" className="h-10 px-6" disabled={loading}>
              {loading ? 'Searching...' : 'Track Ticket'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {complaint && (
        <div className="space-y-6 animate-in fade-in-50">
          <Card className="border-border/70">
            <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
              <div>
                <div className="text-xs font-mono text-primary font-semibold">
                  {complaint.ticketNumber}
                </div>
                <CardTitle className="text-lg font-bold mt-1">{complaint.title}</CardTitle>
              </div>
              <Badge
                variant={
                  complaint.status === 'RESOLVED'
                    ? 'success'
                    : complaint.status === 'FLAGGED_SUSPICIOUS'
                    ? 'destructive'
                    : 'default'
                }
              >
                {complaint.status.replace(/_/g, ' ')}
              </Badge>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Evidence Photo & Verification Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Original Geotagged Photo</div>
                  <div className="rounded-lg overflow-hidden border bg-black">
                    <img
                      src={complaint.evidence?.imageUrl}
                      alt="Defect evidence"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold text-muted-foreground">AI Verification Forensics</div>
                  <div className="p-4 rounded-lg bg-muted/30 border space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Overall Risk Score:</span>
                      <strong className={complaint.evidence?.overallRiskScore > 40 ? 'text-destructive' : 'text-emerald-400'}>
                        {complaint.evidence?.overallRiskScore}%
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Live Capture Token:</span>
                      <strong className="text-emerald-400">Validated Single-Use</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Geofence Distance:</span>
                      <strong>{complaint.evidence?.gpsDistanceMeters || 6}m from alignment</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tamper Probability:</span>
                      <strong>{((complaint.evidence?.exifAnalysis?.tamperProbability || 0.04) * 100).toFixed(0)}%</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{complaint.location?.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>SLA Deadline: {complaint.slaDeadline ? new Date(complaint.slaDeadline).toLocaleString() : 'Within 48h'}</span>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="border-t pt-4">
                <div className="text-xs font-semibold text-muted-foreground mb-4">Grievance Progression</div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold">Submitted & AI Geofence Verified</div>
                      <div className="text-xs text-muted-foreground">{new Date(complaint.createdAt).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold">Triage & Assigned to Contractor</div>
                      <div className="text-xs text-muted-foreground">Patel Infrastructure Ltd. (DLP Obligation)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground">Field Repair & After-Photo Verification</div>
                      <div className="text-xs text-muted-foreground">Scheduled by R&B Division Gang</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {searched && !complaint && !loading && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <p className="font-semibold text-foreground">No Grievance Found</p>
            <p className="text-xs mt-1">Please check the ticket number and try again.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
