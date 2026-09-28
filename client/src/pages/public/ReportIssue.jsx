import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CameraCaptureView } from '@/components/CameraCaptureView'
import { api } from '@/lib/api'
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Building2,
  FileCheck,
  Database,
  BrainCircuit
} from 'lucide-react'

import { RnbLogo } from '@/components/RnbLogo'

export default function ReportIssue() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('POTHOLE')
  const [severity, setSeverity] = useState('HIGH')
  const [address, setAddress] = useState('SG Highway near Thaltej Underpass, Ahmedabad')
  const [description, setDescription] = useState('Multiple deep potholes across middle and right lanes.')
  const [reporterName, setReporterName] = useState('Prashant')
  const [reporterPhone, setReporterPhone] = useState('+91 98250 88990')

  // Live Token & Verified Image State
  const [coords, setCoords] = useState([72.5189, 23.0521])
  const [captureToken, setCaptureToken] = useState(null)
  const [tokenTimeLeft, setTokenTimeLeft] = useState(0)
  const [verifiedImageUrl, setVerifiedImageUrl] = useState('')
  const [verificationData, setVerificationData] = useState(null)
  const [aiFindings, setAiFindings] = useState(null)
  const [source, setSource] = useState('LIVE_CAMERA')
  const [dbImageId, setDbImageId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState(null)

  // Request single-use token on mount
  const obtainCaptureToken = async () => {
    try {
      const res = await api.requestCameraToken(coords)
      if (res.success) {
        setCaptureToken(res.data.token)
        setTokenTimeLeft(res.data.expiresInSeconds)
      }
    } catch (err) {
      console.error('Failed to get token:', err)
    }
  }

  useEffect(() => {
    obtainCaptureToken()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords([pos.coords.longitude, pos.coords.latitude]),
        () => console.log('Using default corridor coords')
      )
    }
  }, [])

  useEffect(() => {
    if (tokenTimeLeft <= 0) return
    const timer = setInterval(() => {
      setTokenTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [tokenTimeLeft])

  // Callback from CameraCaptureView when real photo is taken and verified
  const handleCaptureSuccess = ({ imageUrl, verification, aiFindings, source, dbImageId }) => {
    setVerifiedImageUrl(imageUrl)
    setVerificationData(verification)
    if (aiFindings) setAiFindings(aiFindings)
    if (source) setSource(source)
    if (dbImageId) setDbImageId(dbImageId)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!verifiedImageUrl) {
      return alert('Please snap a photo using the live camera or select an image from gallery first!')
    }
    try {
      setSubmitting(true)
      const payload = {
        title: `${category.replace(/_/g, ' ')} on ${address}`,
        description,
        category,
        severity,
        address,
        coordinates: coords,
        reportedBy: { name: reporterName, phone: reporterPhone, isAnonymous: false },
        captureToken: source === 'LIVE_CAMERA' ? captureToken : undefined,
        imageUrl: verifiedImageUrl,
        dbImageId,
        source,
        fileName: source === 'LIVE_CAMERA' ? 'live_camera_capture.jpg' : 'gallery_upload.jpg',
        verificationResult: verificationData,
        aiFindings,
      }
      const res = await api.createComplaint(payload)
      if (res.success) {
        setSubmittedTicket(res.data)
      }
    } catch (err) {
      alert(`Submission failed: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (submittedTicket) {
    return (
      <div className="min-h-screen bg-[#faf9f5] text-[#141413] p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-8 text-center space-y-5 shadow-lg">
          <div className="w-14 h-14 bg-[#5db872]/15 text-[#5db872] rounded-full flex items-center justify-center mx-auto border border-[#5db872]/30">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-serif text-[#141413]">Grievance Registered</h2>
          <div className="p-4 rounded-lg bg-[#faf9f5] border border-[#e6dfd8] font-mono">
            <div className="text-xs text-[#6c6a64]">Tracking Ticket Number</div>
            <div className="text-xl font-bold text-[#cc785c] mt-1">{submittedTicket.ticketNumber}</div>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs">
            <Badge className="bg-[#5db872]/20 text-[#2e7d32] border border-[#5db872]/40">
              <Database className="w-3 h-3 mr-1" /> Stored in MongoDB
            </Badge>
            <Badge className="bg-[#cc785c]/15 text-[#cc785c] border border-[#cc785c]/30">
              <BrainCircuit className="w-3 h-3 mr-1" /> Nemotron-3 AI Verified
            </Badge>
          </div>
          <p className="text-xs text-[#3d3d3a] leading-relaxed">
            Your photograph was authenticated and stored purely in the database (Risk Score: {submittedTicket.evidence?.overallRiskScore}%). It has been assigned to the R&B maintenance division under state SLA deadlines.
          </p>
          <div className="flex gap-3 pt-2">
            <Link to="/track" className="flex-1">
              <Button variant="outline" className="w-full bg-[#faf9f5] border-[#e6dfd8] hover:bg-[#efe9de] text-[#141413]">
                Track Ticket
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button className="w-full bg-[#cc785c] hover:bg-[#a9583e] text-white">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#141413] p-6 max-w-3xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-[#141413] hover:bg-[#efe9de]">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <RnbLogo className="w-8 h-8" />
            <h1 className="text-3xl font-serif tracking-tight text-[#141413]">Report Road or Infrastructure Defect</h1>
          </div>
          <p className="text-xs text-[#6c6a64] mt-0.5">
            Roads & Buildings Department • Geofenced & Authenticated Live Evidence
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Real Interactive Camera Capture or Gallery Upload */}
        <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3">
            <div>
              <h3 className="font-serif text-xl text-[#141413]">1. Photo Evidence (Live Camera or Gallery)</h3>
              <p className="text-xs text-[#6c6a64]">
                Photo is stored directly into MongoDB and evaluated by OpenRouter AI.
              </p>
            </div>
            {captureToken && (
              <Badge className="bg-[#faf9f5] text-[#cc785c] border border-[#e6dfd8] font-mono text-[11px]">
                Live Token: {tokenTimeLeft}s
              </Badge>
            )}
          </div>

          {/* Interactive Camera Component */}
          <CameraCaptureView
            captureToken={captureToken}
            tokenTimeLeft={tokenTimeLeft}
            coords={coords}
            category={category}
            onCaptureSuccess={handleCaptureSuccess}
          />
        </div>

        {/* Step 2: Defect Categorization */}
        <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-4">
          <h3 className="font-serif text-xl text-[#141413] border-b border-[#e6dfd8] pb-3">
            2. Defect Specification
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#141413]">Defect Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]">
                  <SelectItem value="POTHOLE">Pothole / Surface Cavity</SelectItem>
                  <SelectItem value="CRACKING">Alligator / Thermal Cracking</SelectItem>
                  <SelectItem value="ROAD_CAVING">Road Caving / Base Failure</SelectItem>
                  <SelectItem value="DRAINAGE_OVERFLOW">Drainage Overflow / Waterlogging</SelectItem>
                  <SelectItem value="BRIDGE_EXPANSION_JOINT">Bridge Expansion Joint Damage</SelectItem>
                  <SelectItem value="BUILDING_CRACK">Government Building Structural Crack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#141413]">Severity Level</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]">
                  <SelectItem value="LOW">Low (SLA: 10 Days)</SelectItem>
                  <SelectItem value="MEDIUM">Medium (SLA: 5 Days)</SelectItem>
                  <SelectItem value="HIGH">High (SLA: 48 Hours)</SelectItem>
                  <SelectItem value="CRITICAL">Critical / Hazard (SLA: 24 Hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-[#141413]">Location / Corridor Address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-[#141413]">Description & Road Observations</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md bg-[#faf9f5] border border-[#e6dfd8] p-3 text-xs text-[#141413] focus:outline-none focus:ring-1 focus:ring-[#cc785c]"
            />
          </div>
        </div>

        {/* Step 3: Contact Details */}
        <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-4">
          <h3 className="font-serif text-xl text-[#141413] border-b border-[#e6dfd8] pb-3">
            3. Citizen / Contact Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#141413]">Your Name</Label>
              <Input
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#141413]">Phone Number (For SMS updates)</Label>
              <Input
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={submitting || !verifiedImageUrl}
            className="w-full sm:w-auto px-8 bg-[#cc785c] hover:bg-[#a9583e] text-white font-medium py-2.5 h-auto text-sm shadow-md"
          >
            {submitting ? 'Submitting to R&B Dispatch...' : 'Submit Grievance to R&B Department'}
          </Button>
        </div>
      </form>
    </div>
  )
}
