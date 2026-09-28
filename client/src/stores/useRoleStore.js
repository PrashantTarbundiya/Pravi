import { create } from 'zustand'

export const ROLES = [
  {
    id: 'citizen',
    name: 'Citizen',
    badge: 'Public',
    description: 'Report road issues, upload camera proof, track resolution',
    permissions: ['REPORT_ISSUE', 'TRACK_ISSUE', 'VIEW_MAP'],
  },
  {
    id: 'inspector',
    name: 'Inspector',
    badge: 'Field QA',
    description: 'Perform road inspections and verify contractor repairs',
    permissions: ['INSPECT', 'VERIFY_REPAIRS', 'VIEW_MAP', 'DISPATCH_GANG'],
  },
  {
    id: 'contractor',
    name: 'Contractor',
    badge: 'EPC / DLP',
    description: 'Awarded tenders, milestones, DLP guarantee notices',
    permissions: ['VIEW_PROJECTS', 'SUBMIT_MILESTONE', 'SUBMIT_REPAIR_PROOF', 'ACKNOWLEDGE_DLP'],
  },
  {
    id: 'project_manager',
    name: 'Project Manager',
    badge: 'Executive',
    description: 'Sanction tenders, allocate budgets, approve milestones',
    permissions: ['SANCTION_TENDER', 'APPROVE_MILESTONE', 'DISPATCH_GANG', 'MANAGE_PROJECTS', 'VIEW_AUDIT'],
  },
  {
    id: 'asset_manager',
    name: 'Asset Manager',
    badge: 'Lifecycle',
    description: 'Manage master assets, PCI index, DLP bank guarantees',
    permissions: ['MANAGE_ASSETS', 'ISSUE_DLP_NOTICE', 'DISPATCH_GANG', 'VIEW_GIS'],
  },
  {
    id: 'complaint_officer',
    name: 'Grievance Officer',
    badge: 'Helpdesk',
    description: 'Triage complaints and dispatch road repair gangs',
    permissions: ['DISPATCH_GANG', 'UPDATE_COMPLAINT', 'TRACK_ISSUE', 'VIEW_MAP'],
  },
  {
    id: 'auditor',
    name: 'Auditor',
    badge: 'Vigilance',
    description: 'Inspect Nemotron AI reasoning, flag spoofed photos',
    permissions: ['AUDIT_OVERRIDE', 'QUARANTINE_FRAUD', 'VIEW_AUDIT_LEDGER', 'VIEW_EVIDENCE'],
  },
  {
    id: 'utility_officer',
    name: 'Utility Officer',
    badge: 'RoW',
    description: 'Corridor right-of-way, trenching permits & alignments',
    permissions: ['VIEW_MAP', 'VIEW_ASSETS', 'VIEW_WORK_ORDERS'],
  },
  {
    id: 'admin',
    name: 'Admin',
    badge: 'All Access',
    description: 'Full administrative control over all modules',
    permissions: ['ALL'],
  },
]

export const useRoleStore = create((set, get) => ({
  activeRole: ROLES[4], // Default to Asset Manager
  setRole: (roleId) => {
    const role = ROLES.find((r) => r.id === roleId)
    if (role) {
      set({ activeRole: role })
    }
  },
  can: (permission) => {
    const role = get().activeRole
    if (!role) return false
    if (role.permissions.includes('ALL')) return true
    return role.permissions.includes(permission)
  },
}))

export default useRoleStore
