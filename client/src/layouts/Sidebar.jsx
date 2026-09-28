import { NavLink } from 'react-router-dom'
import { useRoleStore } from '@/stores/useRoleStore'
import { RnbBrand } from '@/components/RnbLogo'
import {
  LayoutDashboard,
  Map as MapIcon,
  HardHat,
  Camera,
  ClipboardList,
  AlertTriangle,
  FileCheck,
  Building2,
  ShieldCheck,
  FileText,
  BadgeAlert,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const SIDEBAR_CONFIG = {
  citizen: [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Report Road Issue', href: '/report', icon: Camera, badge: 'Live Cam' },
    { name: 'Track Grievance', href: '/track', icon: ClipboardList },
    { name: 'Grievance Board', href: '/complaints', icon: AlertTriangle },
    { name: 'Corridor Map', href: '/map', icon: MapIcon },
  ],
  inspector: [
    { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Start Stage Inspection', href: '/inspections/new', icon: Camera, badge: 'MORTH QA' },
    { name: 'Assigned Grievances', href: '/complaints', icon: AlertTriangle },
    { name: 'GIS Asset Map', href: '/map', icon: MapIcon },
    { name: 'Work Orders', href: '/work-orders', icon: HardHat },
    { name: 'Audit Trail', href: '/audit', icon: FileCheck },
  ],
  contractor: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Awarded Tenders', href: '/projects', icon: Building2 },
    { name: 'Work Orders & Milestones', href: '/work-orders', icon: HardHat, badge: 'Milestones' },
    { name: 'Submit Stage Evidence', href: '/inspections/new', icon: Camera },
    { name: 'DLP Warranty Notices', href: '/defects', icon: AlertTriangle, badge: 'Guarantee' },
    { name: 'Report Defect Fix', href: '/complaints', icon: ShieldCheck },
  ],
  project_manager: [
    { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Capital Projects', href: '/projects', icon: Building2 },
    { name: 'Sanction Work Orders', href: '/work-orders', icon: HardHat, badge: 'Sanctions' },
    { name: 'Verification Desk', href: '/verification', icon: FileCheck },
    { name: 'Grievance Redressal', href: '/complaints', icon: AlertTriangle },
    { name: 'GIS Map', href: '/map', icon: MapIcon },
    { name: 'Audit Trail', href: '/audit', icon: FileText },
  ],
  asset_manager: [
    { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Asset Registry', href: '/assets', icon: Building2, badge: 'PCI Index' },
    { name: 'DLP Warranties', href: '/defects', icon: ShieldCheck },
    { name: 'GIS Geoportal', href: '/map', icon: MapIcon },
    { name: 'Grievance Overview', href: '/complaints', icon: AlertTriangle },
    { name: 'Audit Trail', href: '/audit', icon: FileText },
  ],
  complaint_officer: [
    { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Grievance Board', href: '/complaints', icon: AlertTriangle, badge: 'Triage' },
    { name: 'AI Flagged Queue', href: '/verification', icon: ShieldCheck },
    { name: 'Track Citizen Grievance', href: '/track', icon: ClipboardList },
    { name: 'GIS Corridor Map', href: '/map', icon: MapIcon },
  ],
  utility_officer: [
    { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
    { name: 'GIS Asset Map', href: '/map', icon: MapIcon, badge: 'Alignment' },
    { name: 'Asset Registry', href: '/assets', icon: Building2 },
    { name: 'Active Work Orders', href: '/work-orders', icon: HardHat },
    { name: 'Grievance Board', href: '/complaints', icon: AlertTriangle },
  ],
  auditor: [
    { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Flagged Queue', href: '/verification', icon: ShieldCheck, badge: 'Nemotron AI' },
    { name: 'Audit Trail Ledger', href: '/audit', icon: FileText, badge: 'Immutable' },
    { name: 'Asset Registry', href: '/assets', icon: Building2 },
    { name: 'Work Orders', href: '/work-orders', icon: HardHat },
  ],
  admin: [
    { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Asset Registry', href: '/assets', icon: Building2 },
    { name: 'Capital Projects', href: '/projects', icon: HardHat },
    { name: 'Work Orders', href: '/work-orders', icon: HardHat },
    { name: 'Grievance Redressal', href: '/complaints', icon: AlertTriangle },
    { name: 'AI Verification Desk', href: '/verification', icon: ShieldCheck },
    { name: 'GIS Geoportal', href: '/map', icon: MapIcon },
    { name: 'Audit Ledger', href: '/audit', icon: FileText },
  ]
}

export function Sidebar() {
  const { activeRole } = useRoleStore()
  const links = SIDEBAR_CONFIG[activeRole?.id] || SIDEBAR_CONFIG.asset_manager

  return (
    <div className="w-64 h-full bg-[#efe9de] border-r border-[#e6dfd8] flex flex-col flex-shrink-0 text-[#141413]">
      {/* Brand Header with Official R&B Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#e6dfd8]">
        <RnbBrand />
      </div>

      {/* Persona Context Card */}
      <div className="px-4 py-2.5 bg-[#e8e0d2]/70 border-b border-[#e6dfd8] text-[11px] flex items-center justify-between">
        <span className="text-[#6c6a64] font-medium">Logged Persona:</span>
        <span className="font-semibold text-[#cc785c] bg-[#faf9f5] px-2 py-0.5 rounded border border-[#e6dfd8]">
          {activeRole.name}
        </span>
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-3 overflow-y-auto">
        <nav className="space-y-1 px-3">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group",
                    isActive
                      ? "bg-[#cc785c] text-white shadow-sm font-semibold"
                      : "text-[#3d3d3a] hover:bg-[#e8e0d2] hover:text-[#141413]"
                  )
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{link.name}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#faf9f5]/80 text-[#141413] border border-[#e6dfd8] group-hover:border-transparent">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Bottom Status */}
      <div className="p-3.5 border-t border-[#e6dfd8] text-xs text-[#6c6a64] bg-[#efe9de] space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#5db872] animate-pulse" />
            <span className="font-mono text-[10px]">Atlas DB: Online</span>
          </div>
          <span className="text-[10px] font-mono text-[#cc785c]">v2.6.4</span>
        </div>
      </div>
    </div>
  )
}
