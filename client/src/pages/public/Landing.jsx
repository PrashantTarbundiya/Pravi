import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import {
  Camera,
  Search,
  ShieldCheck,
  Building2,
  HardHat,
  ArrowRight,
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react'

import { RnbLogo } from '@/components/RnbLogo'

export default function Landing() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.getSummary().then((res) => {
      if (res.success) setStats(res.kpis)
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#141413] flex flex-col font-sans selection:bg-[#cc785c]/20">
      {/* Top Nav (Claude Top-Nav: 64px, Cream, Hairline border) */}
      <header className="h-16 px-6 border-b border-[#e6dfd8] bg-[#faf9f5] sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RnbLogo className="w-8 h-8" />
          <span className="font-serif text-2xl tracking-tight font-medium text-[#141413]">
            R&B InfraManage
          </span>
          <span className="text-xs font-mono text-[#6c6a64] border-l border-[#e6dfd8] pl-3 ml-1 hidden sm:inline">
            Government of Gujarat
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/track" className="text-sm text-[#3d3d3a] hover:text-[#141413] font-medium hidden sm:inline">
            Track Grievance
          </Link>
          <Link to="/dashboard">
            <Button size="sm" className="bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs h-9 px-4 rounded-md">
              Officer Console <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section (Claude 6-6 Editorial Rhythm) */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (6 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#efe9de] border border-[#e6dfd8] text-xs font-medium text-[#141413]">
              <span className="w-2 h-2 rounded-full bg-[#cc785c]" />
              <span>Verifiable Asset Lifecycle & Defect Liability</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-serif text-[#141413] leading-[1.08] tracking-tight">
              A thinking partner for public roads, bridges, and citizen trust.
            </h1>

            <p className="text-lg text-[#3d3d3a] max-w-xl leading-relaxed">
              Every photograph of road distress or contractor repair is cryptographically validated on-site. Real-time Bayer sensor forensics, geofenced corridor alignment, and 3-year warranty enforcement.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <Link to="/report">
                <Button size="lg" className="h-11 px-6 bg-[#cc785c] hover:bg-[#a9583e] text-white text-sm font-medium rounded-md shadow-sm">
                  <Camera className="w-4 h-4 mr-2" /> Report Defect with Live Cam
                </Button>
              </Link>
              <Link to="/track">
                <Button size="lg" variant="outline" className="h-11 px-6 bg-[#faf9f5] border-[#e6dfd8] hover:bg-[#efe9de] text-[#141413] text-sm font-medium rounded-md">
                  <Search className="w-4 h-4 mr-2" /> Track Ticket by ID
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Claude Dark Product Surface Mockup */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-[#181715] border border-[#282622] text-[#faf9f5] p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#282622] pb-3 text-xs text-[#a09d96]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#cc785c]" />
                  <span className="font-mono text-[11px]">verification_engine.py</span>
                </div>
                <Badge className="bg-[#cc785c]/20 text-[#cc785c] border-none text-[10px] font-mono">
                  ACTIVE PIPELINE
                </Badge>
              </div>

              {/* Terminal Code Snippet (Claude JetBrains Mono Style) */}
              <div className="font-mono text-xs space-y-1.5 text-[#a09d96] bg-[#1f1e1b] p-4 rounded-lg border border-[#282622]">
                <div className="text-[#5db872]"># Layer 1: Single-use cryptographic token check</div>
                <div>token = session.validate(ttl=90)  <span className="text-[#5db872]">✓ PASS</span></div>
                <div className="text-[#5db872] pt-1"># Layer 2: Haversine distance from corridor</div>
                <div>delta_m = geofence.calc(lat, lng) <span className="text-[#5db872]">✓ 6.2m</span></div>
                <div className="text-[#5db872] pt-1"># Layer 3: Bayer matrix & EXIF freshness</div>
                <div>exif.check_tamper_signature()    <span className="text-[#5db872]">✓ CLEAN</span></div>
                <div className="text-[#5db872] pt-1"># Layer 4: Deep vision defect classifier</div>
                <div>score = vision_model.classify()    <span className="text-[#faf9f5] font-bold">Risk: 12%</span></div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#a09d96] pt-1">
                <span>Contractor Liability (DLP):</span>
                <strong className="text-[#faf9f5]">3 Years Active</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Surface Card Section (Claude 3-up Feature Grid in Light Cream #efe9de) */}
      <section className="px-6 py-20 bg-[#f5f0e8] border-y border-[#e6dfd8]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-serif text-[#141413]">The 4-Layer Verification Architecture</h2>
            <p className="text-sm text-[#6c6a64] max-w-xl mx-auto">
              Engineered to bring absolute integrity and scientific certainty to public works reporting.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#cc785c]/10 text-[#cc785c] flex items-center justify-center font-mono font-bold text-xs">
                01
              </div>
              <h3 className="font-serif text-xl text-[#141413]">Live Camera Only</h3>
              <p className="text-xs text-[#3d3d3a] leading-relaxed">
                90-second cryptographic tokens ensure images are snapped live on location. Gallery uploads and re-used files are automatically rejected.
              </p>
            </div>

            <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#cc785c]/10 text-[#cc785c] flex items-center justify-center font-mono font-bold text-xs">
                02
              </div>
              <h3 className="font-serif text-xl text-[#141413]">Corridor Geofence</h3>
              <p className="text-xs text-[#3d3d3a] leading-relaxed">
                Precise Haversine formula calculation compares mobile GPS coordinates against state highway and bridge chainages ($\le 50\text{m}$).
              </p>
            </div>

            <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#cc785c]/10 text-[#cc785c] flex items-center justify-center font-mono font-bold text-xs">
                03
              </div>
              <h3 className="font-serif text-xl text-[#141413]">Forensic Integrity</h3>
              <p className="text-xs text-[#3d3d3a] leading-relaxed">
                Sensor Bayer pattern verification and metadata tag inspection catch AI-generated images, Photoshop adjustments, and stale timestamps.
              </p>
            </div>

            <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#cc785c]/10 text-[#cc785c] flex items-center justify-center font-mono font-bold text-xs">
                04
              </div>
              <h3 className="font-serif text-xl text-[#141413]">Vision Classifier</h3>
              <p className="text-xs text-[#3d3d3a] leading-relaxed">
                Detects potholes, bitumen bleeding, alligator cracking, and certifies contractor resurfacing before milestone stage payments are disbursed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Claude Full-Bleed Coral Callout Card */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <div className="bg-[#cc785c] text-white rounded-xl p-12 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-left">
            <h2 className="text-4xl sm:text-5xl font-serif text-white tracking-tight">
              Ready to verify infrastructure in real time?
            </h2>
            <p className="text-white/90 text-sm leading-relaxed">
              Log into the executive command center, inspect live GIS corridors, or report a road hazard with your mobile camera.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link to="/report">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-[#faf9f5] hover:bg-[#efe9de] text-[#141413] text-sm font-medium rounded-md shadow-md">
                Report a Defect
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 border-white/40 text-white hover:bg-white/10 text-sm font-medium rounded-md">
                Officer Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Claude Dark Navy Footer */}
      <footer className="mt-auto bg-[#181715] text-[#a09d96] border-t border-[#282622] py-14 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-3">
            <RnbLogo className="w-6 h-6" />
            <span className="font-serif text-lg text-[#faf9f5]">R&B InfraManage</span>
            <span className="text-[#6c6a64]">•</span>
            <span>Government of Gujarat</span>
          </div>

          <div className="flex gap-6 text-[#a09d96]">
            <Link to="/dashboard" className="hover:text-[#faf9f5]">Command Center</Link>
            <Link to="/assets" className="hover:text-[#faf9f5]">Asset Registry</Link>
            <Link to="/verification" className="hover:text-[#faf9f5]">Audit Desk</Link>
            <Link to="/track" className="hover:text-[#faf9f5]">Track Grievance</Link>
          </div>

          <div className="text-[#6c6a64] font-mono text-[11px]">
            Connected to Atlas Cluster • © 2026
          </div>
        </div>
      </footer>
    </div>
  )
}
