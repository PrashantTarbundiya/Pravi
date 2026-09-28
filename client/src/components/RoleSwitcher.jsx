import React from 'react'
import { useRoleStore, ROLES } from '@/stores/useRoleStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"

export function RoleSwitcher() {
  const { activeRole, setRole } = useRoleStore()

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <div className="hidden sm:flex items-center gap-1 text-[#6c6a64]">
        <Shield className="w-3.5 h-3.5 text-[#cc785c]" />
        <span className="font-medium text-[11px]">Role:</span>
      </div>
      <Select value={activeRole.id} onValueChange={setRole}>
        <SelectTrigger className="w-[125px] sm:w-[150px] h-8 bg-[#efe9de] border-[#e6dfd8] text-[#141413] text-xs font-semibold focus:ring-1 focus:ring-[#cc785c] rounded-md px-2.5 truncate">
          <SelectValue placeholder="Role">
            {activeRole.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-[#faf9f5] border-[#e6dfd8] text-[#141413] min-w-[210px]">
          {ROLES.map((role) => (
            <SelectItem key={role.id} value={role.id} className="text-xs focus:bg-[#efe9de] py-1.5 cursor-pointer">
              <div className="flex items-center justify-between w-full gap-2">
                <span className="font-medium text-[#141413]">{role.name}</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#efe9de] text-[#cc785c] border border-[#e6dfd8]">
                  {role.badge}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default RoleSwitcher
