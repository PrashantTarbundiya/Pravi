import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import {
  FileText,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  Clock,
  User,
  ArrowRight
} from 'lucide-react'

const MOCK_AUDIT_TRAIL = [
  {
    id: 'AUD-8801',
    action: 'IMAGE_VERIFIED',
    entityType: 'Complaint',
    entityId: 'RNB-GRV-2026-0081',
    performedBy: 'AI Verification Engine (v2.4)',
    riskScoreBefore: 0,
    riskScoreAfter: 12,
    outcome: 'AUTO_APPROVED',
    reason: 'Live capture token validated • Geofence distance 8m • Sensor Bayer pattern matched',
    timestamp: '2026-09-28 10:14:22',
  },
  {
    id: 'AUD-8802',
    action: 'FLAGGED_SUSPICIOUS',
    entityType: 'Complaint',
    entityId: 'RNB-GRV-2026-0082',
    performedBy: 'AI Verification Engine',
    riskScoreBefore: 0,
    riskScoreAfter: 84,
    outcome: 'ROUTED_TO_AUDITOR',
    reason: 'GPS coordinates 4.8km away from bridge alignment • Photoshop metadata marker found',
    timestamp: '2026-09-28 11:02:15',
  },
  {
    id: 'AUD-8803',
    action: 'STAGE_INSPECTION_PASSED',
    entityType: 'Inspection',
    entityId: 'INSP-RNB-2026-101',
    performedBy: 'Er. Rajesh Parmar (DEE R&B)',
    riskScoreBefore: 0,
    riskScoreAfter: 6,
    outcome: 'MILESTONE_RELEASED',
    reason: 'BC Wearing surface temperature 155°C certified • Compaction 98% passed',
    timestamp: '2026-09-28 11:45:00',
  },
  {
    id: 'AUD-8804',
    action: 'DLP_NOTICE_SERVED',
    entityType: 'WorkOrder',
    entityId: 'R&B/TN/2024/091',
    performedBy: 'Executive Engineer (Highways)',
    riskScoreBefore: 0,
    riskScoreAfter: 0,
    outcome: 'NOTICE_ISSUED',
    reason: 'Pothole cluster reported on SH-24 under active 3-year contractor warranty',
    timestamp: '2026-09-28 12:20:09',
  },
]

export default function AuditLogViewer() {
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = MOCK_AUDIT_TRAIL.filter((log) =>
    log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Tamper-Evident Audit Trail</h1>
          <Badge variant="outline" className="text-primary border-primary/30">
            Immutable Ledger
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Cryptographically recorded actions, AI verification scoring, and executive officer overrides
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter by Ticket ID, Inspector, or Action type..."
          className="pl-9 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="border-border/70">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">Audit ID</th>
                  <th className="px-6 py-3 font-semibold">Action / Event</th>
                  <th className="px-6 py-3 font-semibold">Entity Target</th>
                  <th className="px-6 py-3 font-semibold">Actor</th>
                  <th className="px-6 py-3 font-semibold">Risk Score</th>
                  <th className="px-6 py-3 font-semibold">Findings & Rationale</th>
                  <th className="px-6 py-3 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-primary">
                      {log.id}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={log.riskScoreAfter > 50 ? 'destructive' : 'secondary'} className="text-xs">
                        {log.action.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-medium">
                      {log.entityId}
                    </td>
                    <td className="px-6 py-4 text-xs text-foreground">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        {log.performedBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-semibold">
                      {log.riskScoreAfter > 0 ? (
                        <span className={log.riskScoreAfter > 50 ? 'text-destructive font-bold' : 'text-emerald-400'}>
                          {log.riskScoreAfter}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground max-w-xs truncate">
                      {log.reason}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
