import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRoleStore } from '@/stores/useRoleStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import {
  HardHat,
  AlertTriangle,
  Building2,
  Map as MapIcon,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Clock,
  ArrowUpRight
} from 'lucide-react'

import { RnbLogo } from '@/components/RnbLogo'

export default function Dashboard() {
  const { activeRole } = useRoleStore()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await api.getSummary()
      if (res.success) {
        setData(res)
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const kpis = data?.kpis || {
    totalAssets: 8,
    breakdown: { roads: 4, bridges: 2, buildings: 2 },
    dlpProtectedAssets: 4,
    openComplaints: 5,
    resolvedComplaints: 1,
    flaggedSuspiciousPhotos: 1,
    activeWorkOrders: 4,
  }

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
              <h1 className="text-3xl font-serif font-bold text-[#141413]">R&B Command Center</h1>
              <p className="text-xs text-[#6c6a64]">
                Infrastructure Asset Lifecycle, Contractor DLP Guarantees & AI Verification
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="bg-[#faf9f5] border-[#e6dfd8] hover:bg-[#efe9de] text-[#141413] text-xs h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Sync Atlas DB
          </Button>
          <div className="text-xs bg-[#efe9de] border border-[#e6dfd8] px-3.5 py-1.5 rounded-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5db872]" />
            <span>Role: <strong className="text-[#141413]">{activeRole.name}</strong></span>
          </div>
        </div>
      </div>

      {/* KPI Cards (Claude Feature Card Style: #efe9de with #e6dfd8 hairline) */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6c6a64]">
            <span>Registered Assets</span>
            <Building2 className="h-4 w-4 text-[#cc785c]" />
          </div>
          <div className="text-4xl font-serif text-[#141413]">{kpis.totalAssets}</div>
          <div className="text-xs text-[#6c6a64]">
            {kpis.breakdown?.roads || 2} Roads • {kpis.breakdown?.bridges || 1} Bridges • {kpis.breakdown?.buildings || 1} Bldgs
          </div>
        </div>

        <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6c6a64]">
            <span>Under DLP Warranty</span>
            <ShieldCheck className="h-4 w-4 text-[#cc785c]" />
          </div>
          <div className="text-4xl font-serif text-[#cc785c]">{kpis.dlpProtectedAssets}</div>
          <div className="text-xs text-[#6c6a64]">
            Contractors bound by 3-yr bank guarantee
          </div>
        </div>

        <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6c6a64]">
            <span>Active Grievances</span>
            <AlertTriangle className="h-4 w-4 text-[#e8a55a]" />
          </div>
          <div className="text-4xl font-serif text-[#141413]">{kpis.openComplaints}</div>
          <div className="text-xs text-[#6c6a64]">
            Geotagged citizen reports in progress
          </div>
        </div>

        <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6c6a64]">
            <span>Flagged for Audit</span>
            <ShieldAlert className="h-4 w-4 text-[#c64545]" />
          </div>
          <div className="text-4xl font-serif text-[#c64545]">{kpis.flaggedSuspiciousPhotos}</div>
          <div className="text-xs text-[#6c6a64]">
            Mismatched GPS or altered EXIF detected
          </div>
        </div>
      </div>

      {/* Main Grid: GIS Corridor & Execution Status */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column (8 Cols): Dark Navy Product Surface Mockup */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl bg-[#181715] border border-[#282622] text-[#faf9f5] p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#282622] pb-4">
              <div>
                <h3 className="font-serif text-2xl text-[#faf9f5]">R&B Geoportal & Corridor Alignment</h3>
                <p className="text-xs text-[#a09d96] mt-0.5">
                  State Highways, Bridges, and geofence tolerance corridors
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/map">
                  <Button size="sm" className="bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs h-7">
                    <MapIcon className="w-3.5 h-3.5 mr-1" /> Open Live GIS Map
                  </Button>
                </Link>
                <Badge className="bg-[#cc785c]/20 text-[#cc785c] border-none text-xs font-mono">
                  50m Buffer
                </Badge>
              </div>
            </div>

            {/* Corridor List on Dark Surface */}
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-lg bg-[#252320] border border-[#33312c] space-y-1">
                <div className="text-[#a09d96]">SH-24 (SG Highway)</div>
                <div className="font-serif text-lg text-[#faf9f5]">Corridor KM 0-12.5</div>
                <div className="text-[#5db872] font-mono">PCI: 86/100 (Good)</div>
              </div>

              <div className="p-4 rounded-lg bg-[#252320] border border-[#33312c] space-y-1">
                <div className="text-[#a09d96]">BR-102 (Sabarmati)</div>
                <div className="font-serif text-lg text-[#faf9f5]">Cable-Stayed Bridge</div>
                <div className="text-[#5db872] font-mono">PCI: 94/100 (Excellent)</div>
              </div>

              <div className="p-4 rounded-lg bg-[#252320] border border-[#33312c] space-y-1">
                <div className="text-[#a09d96]">MDR-08 (Sanand)</div>
                <div className="font-serif text-lg text-[#faf9f5]">Industrial Link</div>
                <div className="text-[#e8a55a] font-mono">PCI: 54/100 (Needs Overlay)</div>
              </div>
            </div>

            {/* 4-Layer Terminal Log */}
            <div className="bg-[#1f1e1b] rounded-lg border border-[#282622] p-4 font-mono text-xs text-[#a09d96] space-y-1.5">
              <div className="text-[#cc785c] font-semibold">// Live Verification Engine Logs</div>
              <div>[Layer 1] Live camera single-use token: <span className="text-[#5db872]">VALIDATED (90s TTL)</span></div>
              <div>[Layer 2] Haversine geofence calculation: <span className="text-[#5db872]">6m from alignment (PASS)</span></div>
              <div>[Layer 3] EXIF software & Bayer pattern: <span className="text-[#5db872]">Original raw sensor</span></div>
              <div>[Layer 4] Vision model defect classification: <span className="text-[#faf9f5]">Pothole distress (96% conf)</span></div>
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Light Cream Cards */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-4">
            <h3 className="font-serif text-xl text-[#141413] border-b border-[#e6dfd8] pb-3">
              Active DLP Warranties
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-[#faf9f5] border border-[#e6dfd8] space-y-1 text-xs">
                <div className="flex justify-between font-medium">
                  <span>Patel Engineering Ltd.</span>
                  <span className="text-[#cc785c]">3-Yr DLP</span>
                </div>
                <div className="text-[#6c6a64]">SH-24 Corridors (KM 0 to 12.5)</div>
                <div className="text-[11px] text-[#6c6a64]">Expires: March 2027</div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#faf9f5] border border-[#e6dfd8] space-y-1 text-xs">
                <div className="flex justify-between font-medium">
                  <span>Monte Carlo Infra</span>
                  <span className="text-[#cc785c]">DLP Active</span>
                </div>
                <div className="text-[#6c6a64]">Zonal Administrative Complex</div>
                <div className="text-[11px] text-[#6c6a64]">Expires: Dec 2026</div>
              </div>
            </div>
          </div>

          <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-4">
            <h3 className="font-serif text-xl text-[#141413] border-b border-[#e6dfd8] pb-3">
              Recent Field Certification
            </h3>
            <div className="p-3.5 rounded-lg bg-[#faf9f5] border border-[#e6dfd8] space-y-1.5 text-xs">
              <div className="flex justify-between font-medium">
                <span className="font-mono text-xs text-[#cc785c]">INSP-RNB-2026-101</span>
                <span className="text-[#5db872]">PASSED</span>
              </div>
              <p className="text-[#3d3d3a]">SH-24 Bituminous Concrete (BC Layer)</p>
              <div className="text-[11px] text-[#6c6a64] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#cc785c]" /> Er. Rajesh Parmar (DEE)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
