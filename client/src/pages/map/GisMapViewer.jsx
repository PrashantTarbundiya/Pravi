import React, { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import {
  MapPin,
  Navigation,
  Layers,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Database,
  BrainCircuit,
  Eye,
  Crosshair
} from 'lucide-react'

// Controller component to smoothly re-center map
function MapFlyTo({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 13, { duration: 1.2 })
    }
  }, [center, zoom, map])
  return null
}

// Custom Leaflet DivIcons matching Claude aesthetic
const createDefectIcon = (category, riskScore, isLiveCapture) => {
  const isHighRisk = riskScore >= 50
  const color = isHighRisk ? '#c64545' : '#cc785c'
  const glow = isHighRisk ? 'rgba(198, 69, 69, 0.4)' : 'rgba(204, 120, 92, 0.4)'

  return L.divIcon({
    className: 'custom-gis-pin',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <span style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: ${glow}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <div style="width: 28px; height: 28px; border-radius: 9999px; background-color: ${color}; border: 2.5px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  })
}

const createAssetIcon = (type = 'ROAD') => {
  const color = type === 'BRIDGE' ? '#e8a55a' : type === 'GOVERNMENT_BUILDING' ? '#5db8a6' : '#5db872'
  return L.divIcon({
    className: 'custom-asset-pin',
    html: `
      <div style="width: 24px; height: 24px; border-radius: 6px; background-color: ${color}; border: 2px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2"></rect>
          <path d="M9 3v18"></path>
          <path d="M15 3v18"></path>
        </svg>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })
}

// Default fallback corridors for Ahmedabad R&B Division if DB has partial geometry
const DEFAULT_CORRIDORS = [
  {
    code: 'RNB-GJ-SH-24',
    name: 'State Highway 24 (SG Highway Corridor)',
    pci: 82,
    coordinates: [
      [23.0225, 72.5050],
      [23.0350, 72.5120],
      [23.0520, 72.5200],
      [23.0780, 72.5290],
      [23.1120, 72.5380],
    ],
    contractor: 'Patel Infrastructure Ltd.',
    dlpValidTill: '2028-06-30',
  },
  {
    code: 'RNB-GJ-MDR-09',
    name: 'SP Ring Road West Section',
    pci: 74,
    coordinates: [
      [23.0010, 72.4820],
      [23.0300, 72.4780],
      [23.0650, 72.4850],
      [23.0980, 72.5010],
    ],
    contractor: 'L&T Transportation Ltd.',
    dlpValidTill: '2027-11-15',
  },
  {
    code: 'RNB-GJ-BR-01',
    name: 'Subhash Bridge Overpass Corridor',
    pci: 88,
    coordinates: [
      [23.0580, 72.5780],
      [23.0620, 72.5850],
      [23.0680, 72.5920],
    ],
    contractor: 'Afcons Construction',
    dlpValidTill: '2029-03-31',
  },
]

export default function GisMapViewer() {
  const [assets, setAssets] = useState([])
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [filterType, setFilterType] = useState('ALL') // 'ALL' | 'HIGH_RISK' | 'DLP' | 'ROADS'
  const [mapCenter, setMapCenter] = useState([23.0521, 72.5189])
  const [zoomLevel, setZoomLevel] = useState(12)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTileLayer, setActiveTileLayer] = useState('osm') // 'osm' | 'satellite'

  const loadData = async () => {
    try {
      setLoading(true)
      const [assetRes, complaintRes] = await Promise.all([
        api.getAssets(),
        api.getComplaints(),
      ])

      if (assetRes.success) setAssets(assetRes.data || [])
      if (complaintRes.success) {
        setComplaints(complaintRes.data || [])
        if (complaintRes.data?.length > 0 && !selectedFeature) {
          setSelectedFeature({ type: 'COMPLAINT', data: complaintRes.data[0] })
        }
      }
    } catch (err) {
      console.error('Failed to load GIS data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filter complaints based on user filter chips
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Must have valid coordinates [lng, lat]
      const coords = c.location?.coordinates
      if (!coords || !Array.isArray(coords) || coords.length < 2) return false

      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchTitle = c.title?.toLowerCase().includes(q)
        const matchTicket = c.ticketNumber?.toLowerCase().includes(q)
        const matchAddress = c.location?.address?.toLowerCase().includes(q)
        if (!matchTitle && !matchTicket && !matchAddress) return false
      }

      if (filterType === 'HIGH_RISK') return (c.evidence?.overallRiskScore || 0) >= 45
      if (filterType === 'ROADS') return c.category === 'POTHOLE' || c.category === 'CRACKING'
      return true
    })
  }, [complaints, filterType, searchQuery])

  // Corridors to render
  const corridors = useMemo(() => {
    // If DB assets have coordinates, use them; otherwise use default Ahmedabad network
    const assetLines = []
    assets.forEach((a) => {
      if (a.geometry?.type === 'LineString' && Array.isArray(a.geometry.coordinates)) {
        // Convert [lng, lat] to Leaflet [lat, lng]
        const latLngs = a.geometry.coordinates.map((pt) => [pt[1], pt[0]])
        if (latLngs.length >= 2) {
          assetLines.push({
            code: a.assetCode,
            name: a.name,
            pci: a.overallCondition || 80,
            coordinates: latLngs,
            contractor: a.dlp?.contractorName || 'R&B Department',
            dlpValidTill: a.dlp?.endDate,
          })
        }
      }
    })
    return assetLines.length > 0 ? assetLines : DEFAULT_CORRIDORS
  }, [assets])

  const centerOnAhmedabad = () => {
    setMapCenter([23.0521, 72.5189])
    setZoomLevel(12)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-serif tracking-tight text-[#141413]">
              R&B GIS Infrastructure Geoportal
            </h1>
            <Badge variant="outline" className="border-[#cc785c] text-[#cc785c] bg-[#cc785c]/10 text-xs">
              Live Ahmedabad Division
            </Badge>
          </div>
          <p className="text-xs text-[#6c6a64] mt-0.5">
            Spatial representation of State Highways, Major District Roads, and live AI-verified citizen defect reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={centerOnAhmedabad}
            className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413] hover:bg-[#efe9de] text-xs"
          >
            <Crosshair className="w-3.5 h-3.5 mr-1 text-[#cc785c]" /> Center Corridor
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413] hover:bg-[#efe9de] text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh Map
          </Button>
        </div>
      </div>

      {/* Filter and Layer Controls Bar */}
      <div className="p-4 rounded-xl bg-[#efe9de] border border-[#e6dfd8] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-[#141413] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#cc785c]" /> Filters:
          </span>
          <Button
            size="sm"
            variant={filterType === 'ALL' ? 'default' : 'outline'}
            onClick={() => setFilterType('ALL')}
            className={`h-7 text-xs ${filterType === 'ALL' ? 'bg-[#cc785c] text-white hover:bg-[#a9583e]' : 'bg-[#faf9f5] border-[#e6dfd8] text-[#141413]'}`}
          >
            All Defects ({complaints.length})
          </Button>
          <Button
            size="sm"
            variant={filterType === 'HIGH_RISK' ? 'default' : 'outline'}
            onClick={() => setFilterType('HIGH_RISK')}
            className={`h-7 text-xs ${filterType === 'HIGH_RISK' ? 'bg-[#c64545] text-white' : 'bg-[#faf9f5] border-[#e6dfd8] text-[#141413]'}`}
          >
            High Risk & Anomalies
          </Button>
          <Button
            size="sm"
            variant={filterType === 'ROADS' ? 'default' : 'outline'}
            onClick={() => setFilterType('ROADS')}
            className={`h-7 text-xs ${filterType === 'ROADS' ? 'bg-[#cc785c] text-white' : 'bg-[#faf9f5] border-[#e6dfd8] text-[#141413]'}`}
          >
            Potholes & Cracking
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {/* Map Base Tile Switcher */}
          <div className="flex items-center gap-1 bg-[#faf9f5] border border-[#e6dfd8] rounded-md p-0.5">
            <button
              type="button"
              onClick={() => setActiveTileLayer('osm')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                activeTileLayer === 'osm' ? 'bg-[#cc785c] text-white' : 'text-[#6c6a64] hover:text-[#141413]'
              }`}
            >
              OpenStreetMap
            </button>
            <button
              type="button"
              onClick={() => setActiveTileLayer('satellite')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                activeTileLayer === 'satellite' ? 'bg-[#cc785c] text-white' : 'text-[#6c6a64] hover:text-[#141413]'
              }`}
            >
              Satellite Imagery
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-44">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8e8b82]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search corridor..."
              className="h-7 text-xs pl-8 bg-[#faf9f5] border-[#e6dfd8] text-[#141413]"
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Interactive Leaflet Map Visualizer */}
        <div className="lg:col-span-8">
          <Card className="overflow-hidden border border-[#e6dfd8] shadow-lg rounded-xl">
            <div className="relative h-[620px] w-full">
              {/* The Real Leaflet Map Container */}
              <MapContainer
                center={mapCenter}
                zoom={zoomLevel}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
              >
                <MapFlyTo center={mapCenter} zoom={zoomLevel} />

                {/* Dynamic Base Map Tile Layer */}
                {activeTileLayer === 'osm' && (
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                  />
                )}
                {activeTileLayer === 'satellite' && (
                  <TileLayer
                    attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={18}
                  />
                )}

                {/* Render Road Corridors as Polylines */}
                {corridors.map((corridor, idx) => {
                  const strokeColor = corridor.pci > 80 ? '#5db872' : corridor.pci > 65 ? '#e8a55a' : '#c64545'
                  return (
                    <Polyline
                      key={`corridor-${idx}`}
                      positions={corridor.coordinates}
                      pathOptions={{
                        color: strokeColor,
                        weight: 6,
                        opacity: 0.85,
                        dashArray: corridor.pci < 65 ? '8, 8' : undefined,
                      }}
                      eventHandlers={{
                        click: () => {
                          setSelectedFeature({ type: 'CORRIDOR', data: corridor })
                        },
                      }}
                    >
                      <Popup>
                        <div className="p-2 space-y-1 text-xs font-sans">
                          <div className="font-bold text-sm text-[#141413]">{corridor.name}</div>
                          <div className="text-[#6c6a64] font-mono text-[11px]">{corridor.code}</div>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="font-semibold">PCI Condition:</span>
                            <span className="font-bold" style={{ color: strokeColor }}>{corridor.pci} / 100</span>
                          </div>
                          <div>Contractor: {corridor.contractor}</div>
                          <button
                            type="button"
                            onClick={() => setSelectedFeature({ type: 'CORRIDOR', data: corridor })}
                            className="mt-2 w-full py-1 text-xs bg-[#cc785c] text-white rounded font-medium hover:bg-[#a9583e]"
                          >
                            Inspect Corridor Details
                          </button>
                        </div>
                      </Popup>
                    </Polyline>
                  )
                })}

                {/* Render Complaints / Defects as Real Markers */}
                {filteredComplaints.map((item) => {
                  const coords = item.location?.coordinates
                  if (!coords || coords.length < 2) return null
                  // Leaflet takes [latitude, longitude]
                  const latLng = [coords[1], coords[0]]
                  const riskScore = item.evidence?.overallRiskScore || 0
                  const isLive = item.evidence?.isLiveCapture ?? true

                  return (
                    <Marker
                      key={item._id || item.ticketNumber}
                      position={latLng}
                      icon={createDefectIcon(item.category, riskScore, isLive)}
                      eventHandlers={{
                        click: () => {
                          setSelectedFeature({ type: 'COMPLAINT', data: item })
                          setMapCenter(latLng)
                        },
                      }}
                    >
                      <Popup>
                        <div className="p-1 space-y-2 text-xs font-sans max-w-[220px]">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold text-[#cc785c]">
                              {item.ticketNumber}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#cc785c]/15 text-[#cc785c] font-mono">
                              Risk: {riskScore}%
                            </span>
                          </div>
                          <div className="font-semibold text-xs text-[#141413] line-clamp-2">
                            {item.title}
                          </div>
                          {item.evidence?.imageUrl && (
                            <img
                              src={item.evidence.imageUrl}
                              alt="Defect"
                              className="w-full h-24 object-cover rounded border"
                            />
                          )}
                          <div className="text-[11px] text-[#6c6a64]">
                            {item.location?.address}
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedFeature({ type: 'COMPLAINT', data: item })}
                            className="w-full py-1 text-xs bg-[#cc785c] text-white rounded font-medium hover:bg-[#a9583e]"
                          >
                            View Full Evidence
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MapContainer>

              {/* Floating Legend Overlay */}
              <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur border border-[#e6dfd8] p-3 rounded-lg shadow-md text-xs space-y-2 pointer-events-auto">
                <div className="font-semibold text-[11px] text-[#141413]">Corridor PCI & Defect Legend</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-[#3d3d3a]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-1.5 bg-[#5db872] rounded" /> Good (PCI &gt; 80)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-1.5 bg-[#e8a55a] rounded" /> Fair (PCI 65-80)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-1.5 bg-[#c64545] rounded" /> Poor (PCI &lt; 65)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#cc785c]" /> Verified Defect
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Feature Inspection Drawer (Right Column) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border border-[#e6dfd8] bg-[#efe9de] shadow-sm">
            <CardHeader className="py-4 px-6 border-b border-[#e6dfd8]">
              <CardTitle className="text-base font-serif text-[#141413] flex items-center justify-between">
                <span>Feature Dossier</span>
                {selectedFeature && (
                  <Badge variant="outline" className="border-[#cc785c] text-[#cc785c] text-[10px] font-mono">
                    {selectedFeature.type}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              {selectedFeature ? (
                selectedFeature.type === 'COMPLAINT' ? (
                  /* Complaint Evidence Dossier */
                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="font-mono text-xs text-[#cc785c] font-semibold">
                        {selectedFeature.data.ticketNumber}
                      </div>
                      <h3 className="font-serif text-lg text-[#141413] mt-1 leading-snug">
                        {selectedFeature.data.title}
                      </h3>
                    </div>

                    {/* Image Preview from MongoDB */}
                    {selectedFeature.data.evidence?.imageUrl && (
                      <div className="rounded-lg overflow-hidden border border-[#e6dfd8] bg-black max-h-48 flex items-center justify-center">
                        <img
                          src={selectedFeature.data.evidence.imageUrl}
                          alt="Evidence"
                          className="w-full h-48 object-contain"
                        />
                      </div>
                    )}

                    <div className="p-3 rounded bg-[#faf9f5] border border-[#e6dfd8] space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[#6c6a64]">Storage Engine:</span>
                        <strong className="text-emerald-600 font-mono flex items-center gap-1">
                          <Database className="w-3 h-3" /> Stored in MongoDB Atlas
                        </strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#6c6a64]">Photo Source:</span>
                        <strong className="text-[#141413] font-mono">
                          {selectedFeature.data.evidence?.isLiveCapture ? 'Live In-App Camera' : 'Device Gallery Upload'}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#6c6a64]">GPS Distance:</span>
                        <strong className="text-[#141413] font-mono">
                          {selectedFeature.data.evidence?.gpsDistanceMeters || 4}m from Alignment
                        </strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#6c6a64]">AI Risk Score:</span>
                        <strong className={selectedFeature.data.evidence?.overallRiskScore > 45 ? 'text-[#c64545]' : 'text-emerald-600'}>
                          {selectedFeature.data.evidence?.overallRiskScore}%
                        </strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#6c6a64]">Predicted Defect:</span>
                        <strong className="text-[#cc785c] font-semibold">
                          {selectedFeature.data.evidence?.aiClassification?.predictedDefect || selectedFeature.data.category}
                        </strong>
                      </div>
                    </div>

                    {/* OpenRouter Reasoning Card */}
                    {selectedFeature.data.evidence?.aiClassification?.reasoning && (
                      <div className="p-3 rounded bg-[#faf9f5] border border-[#e6dfd8] space-y-1.5">
                        <div className="flex items-center gap-1.5 font-medium text-[#141413]">
                          <BrainCircuit className="w-3.5 h-3.5 text-[#cc785c]" />
                          <span>Nemotron-3 Reasoning</span>
                        </div>
                        <p className="text-[11px] text-[#3d3d3a] font-mono leading-relaxed line-clamp-4">
                          {selectedFeature.data.evidence.aiClassification.reasoning}
                        </p>
                      </div>
                    )}

                    <div className="pt-2">
                      <Button
                        onClick={() => {
                          const coords = selectedFeature.data.location?.coordinates
                          if (coords) setMapCenter([coords[1], coords[0]])
                          setZoomLevel(15)
                        }}
                        className="w-full bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs h-8"
                      >
                        <Navigation className="w-3.5 h-3.5 mr-1.5" /> Zoom to Coordinates
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Corridor Inspection Dossier */
                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="font-mono text-xs text-[#cc785c] font-semibold">
                        {selectedFeature.data.code}
                      </div>
                      <h3 className="font-serif text-lg text-[#141413] mt-1 leading-snug">
                        {selectedFeature.data.name}
                      </h3>
                    </div>

                    <div className="p-3 rounded bg-[#faf9f5] border border-[#e6dfd8] space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[#6c6a64]">Pavement Condition Index:</span>
                        <strong className="text-emerald-600 font-mono text-sm">
                          {selectedFeature.data.pci} / 100 (Good)
                        </strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#6c6a64]">EPC Contractor:</span>
                        <strong className="text-[#141413]">{selectedFeature.data.contractor}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#6c6a64]">DLP Warranty End:</span>
                        <strong className="text-[#cc785c] font-mono">
                          {selectedFeature.data.dlpValidTill || 'Under 5-Year DLP'}
                        </strong>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={() => {
                          const mid = selectedFeature.data.coordinates[Math.floor(selectedFeature.data.coordinates.length / 2)]
                          if (mid) setMapCenter(mid)
                          setZoomLevel(14)
                        }}
                        className="w-full bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs h-8"
                      >
                        <Navigation className="w-3.5 h-3.5 mr-1.5" /> Center on Corridor
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                <div className="p-10 text-center text-[#6c6a64] text-xs">
                  Click any road corridor line or defect marker on the map to inspect GIS metadata.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
