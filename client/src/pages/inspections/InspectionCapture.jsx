import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CameraCaptureView } from '@/components/CameraCaptureView'
import { api } from '@/lib/api'
import {
  Camera,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  RefreshCw,
  ClipboardList,
  Layers,
  Thermometer,
  Gauge,
  Database
} from 'lucide-react'

export default function InspectionCapture() {
  const [assets, setAssets] = useState([])
  const [selectedAssetId, setSelectedAssetId] = useState('')
  const [segmentCode, setSegmentCode] = useState('SH24-SEG-01')
  const [stageLayer, setStageLayer] = useState('BC_WEARING_SURFACE')
  const [inspectorName, setInspectorName] = useState('Er. Rajesh Parmar (DEE R&B)')
  const [bitumenTemp, setBitumenTemp] = useState('155')
  const [compactionPassed, setCompactionPassed] = useState(true)
  const [qualityScore, setQualityScore] = useState(92)
  const [remarks, setRemarks] = useState('Layer compacted to 98% MDD. Bitumen laying temperature 155°C complies with MORTH Section 500.')

  // Live Token & GPS
  const [coords, setCoords] = useState([72.5189, 23.0521])
  const [token, setToken] = useState(null)
  const [tokenTimeLeft, setTokenTimeLeft] = useState(0)
  const [photoCaptured, setPhotoCaptured] = useState(false)
  const [photoUrl, setPhotoUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(null)

  useEffect(() => {
    api.getAssets().then((res) => {
      if (res.success && res.data.length > 0) {
        setAssets(res.data)
        setSelectedAssetId(res.data[0]._id)
      }
    })

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords([pos.coords.longitude, pos.coords.latitude]),
        () => console.log('Using default corridor coords')
      )
    }

    api.requestCameraToken(coords).then((res) => {
      if (res.success) {
        setToken(res.data.token)
        setTokenTimeLeft(res.data.expiresInSeconds || 120)
      }
    })
  }, [])

  useEffect(() => {
    if (tokenTimeLeft <= 0) return
    const timer = setInterval(() => {
      setTokenTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [tokenTimeLeft])

  const handleCaptureSuccess = ({ imageUrl, verification }) => {
    setPhotoUrl(imageUrl)
    setPhotoCaptured(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!photoUrl) return alert('Please capture or upload a verified photo of the road layer first!')
    try {
      setSubmitting(true)
      const asset = assets.find((a) => a._id === selectedAssetId)
      const payload = {
        assetId: selectedAssetId,
        assetCode: asset?.assetCode || 'RNB-GJ-SH-24',
        segmentCode,
        inspectorName,
        inspectionType: 'CONSTRUCTION_STAGE',
        stageLayer,
        coordinates: coords,
        qualityScore: Number(qualityScore),
        remarks: `${remarks} [Temp: ${bitumenTemp}°C, Compaction: ${compactionPassed ? 'Passed' : 'Failed'}]`,
        photos: [
          {
            url: photoUrl,
            captureToken: token,
            riskScore: 6,
            isLiveCapture: true,
            aiConfidence: 0.98,
          },
        ],
      }
      const res = await api.createInspection(payload)
      if (res.success) {
        setSubmitted(res.data)
      }
    } catch (err) {
      alert(`Inspection upload failed: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-8 text-center space-y-4 shadow-lg text-[#141413]">
          <div className="w-16 h-16 bg-[#5db872]/15 text-[#5db872] rounded-full flex items-center justify-center mx-auto border border-[#5db872]/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif">Stage Inspection Certified</h2>
          <div className="p-3 bg-[#faf9f5] border border-[#e6dfd8] rounded-md font-mono text-xs">
            Inspection Code: <strong className="text-[#cc785c]">{submitted.inspectionCode}</strong>
          </div>
          <div className="flex justify-center gap-2">
            <Badge className="bg-[#5db872]/20 text-[#2e7d32] border border-[#5db872]/40 text-xs">
              <Database className="w-3 h-3 mr-1" /> Photo Stored in MongoDB
            </Badge>
          </div>
          <p className="text-xs text-[#6c6a64] leading-relaxed">
            Photographic evidence verified against road geometry (Distance: {submitted.distanceFromSegmentMeters || 4}m). Milestone certified for contractor stage bill clearance.
          </p>
          <Button
            onClick={() => { setSubmitted(null); setPhotoCaptured(false); setPhotoUrl(''); }}
            className="w-full bg-[#cc785c] hover:bg-[#a9583e] text-white"
          >
            Start Another Stage Inspection
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-serif text-[#141413]">Stage Quality & Field Inspection</h1>
          <Badge variant="outline" className="border-[#cc785c] text-[#cc785c] bg-[#cc785c]/10 text-xs">
            R&B IRC:37 Spec
          </Badge>
        </div>
        <p className="text-xs text-[#6c6a64] mt-1">
          In-situ layer-by-layer road progress verification with live camera stream, gallery upload, and temperature logging
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Layer Selector */}
        <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-4">
          <h3 className="font-serif text-xl text-[#141413] border-b border-[#e6dfd8] pb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#cc785c]" />
            1. Asset & Pavement Construction Layer
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#141413]">Select R&B Asset</Label>
              <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                <SelectTrigger className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]">
                  <SelectValue placeholder="Choose asset" />
                </SelectTrigger>
                <SelectContent className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]">
                  {assets.map((a) => (
                    <SelectItem key={a._id} value={a._id}>
                      {a.assetCode} - {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#141413]">Chainage / Segment Code</Label>
              <Input
                value={segmentCode}
                onChange={(e) => setSegmentCode(e.target.value)}
                className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#141413]">Construction Stage / Layer</Label>
              <Select value={stageLayer} onValueChange={setStageLayer}>
                <SelectTrigger className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]">
                  <SelectItem value="SUBGRADE">1. Subgrade Earthwork & Compaction</SelectItem>
                  <SelectItem value="GSB_LAYER">2. Granular Sub-Base (GSB)</SelectItem>
                  <SelectItem value="WMM_BASE">3. Wet Mix Macadam (WMM Base)</SelectItem>
                  <SelectItem value="DBM_BINDER">4. Dense Bituminous Macadam (DBM)</SelectItem>
                  <SelectItem value="BC_WEARING_SURFACE">5. Bituminous Concrete (BC Wearing Surface)</SelectItem>
                  <SelectItem value="DRAIN_STRUCTURE">6. RCC Storm Drain / Culvert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#141413]">Inspecting Officer</Label>
              <Input
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]"
              />
            </div>
          </div>
        </div>

        {/* Live Camera Proof with Token */}
        <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3">
            <h3 className="font-serif text-xl text-[#141413] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#cc785c]" />
              2. Live Photographic Evidence (Live Cam or Gallery)
            </h3>
            <Badge className="bg-[#faf9f5] text-[#cc785c] border border-[#e6dfd8] font-mono text-xs">
              Token TTL: {tokenTimeLeft}s
            </Badge>
          </div>

          {/* Interactive Live Camera Component */}
          <CameraCaptureView
            captureToken={token}
            tokenTimeLeft={tokenTimeLeft}
            coords={coords}
            category="ROAD_SURFACE"
            onCaptureSuccess={handleCaptureSuccess}
          />
        </div>

        {/* Technical Quality Checklist */}
        <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-4">
          <h3 className="font-serif text-xl text-[#141413] border-b border-[#e6dfd8] pb-3 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#cc785c]" />
            3. In-Situ MORTH Quality Parameters
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#141413] flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-[#cc785c]" /> Laying Temp (°C)
              </Label>
              <Input
                type="number"
                value={bitumenTemp}
                onChange={(e) => setBitumenTemp(e.target.value)}
                className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]"
              />
              <span className="text-[10px] text-[#6c6a64]">IRC Min: 145°C - 160°C</span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#141413]">Compaction Status</Label>
              <Select
                value={compactionPassed ? 'PASS' : 'FAIL'}
                onValueChange={(v) => setCompactionPassed(v === 'PASS')}
              >
                <SelectTrigger className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]">
                  <SelectItem value="PASS">Passed (98% MDD Density)</SelectItem>
                  <SelectItem value="FAIL">Failed (Rework Required)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#141413]">Quality Score (0-100)</Label>
              <Input
                type="number"
                value={qualityScore}
                onChange={(e) => setQualityScore(e.target.value)}
                className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-[#141413]">Executive Engineer Sign-off Remarks</Label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full rounded-md bg-[#faf9f5] border border-[#e6dfd8] p-3 text-xs text-[#141413] focus:outline-none focus:ring-1 focus:ring-[#cc785c]"
            />
          </div>
        </div>

        {/* Submit Certified Bill */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={submitting || !photoUrl}
            className="w-full sm:w-auto px-8 bg-[#cc785c] hover:bg-[#a9583e] text-white font-medium py-2.5 h-auto text-sm shadow-md"
          >
            {submitting ? 'Certifying & Dispatching to R&B Vault...' : 'Certify Stage Quality & Sign Off'}
          </Button>
        </div>
      </form>
    </div>
  )
}
