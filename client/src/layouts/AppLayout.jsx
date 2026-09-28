import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { RoleSwitcher } from '@/components/RoleSwitcher'
import { QuickSearchModal } from '@/components/QuickSearchModal'
import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'

export function AppLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex h-screen w-full bg-[#faf9f5] text-[#141413] overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-[#e6dfd8] bg-[#faf9f5]">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="text-xs text-[#6c6a64] bg-[#efe9de] border border-[#e6dfd8] px-3.5 py-1.5 rounded-md flex items-center gap-2 cursor-pointer hover:border-[#cc785c]/40 hover:bg-[#efe9de]/80 transition-all text-left"
            >
              <Search className="w-3.5 h-3.5 text-[#cc785c]" />
              <span>Search assets, roads, or tickets...</span>
              <kbd className="text-[10px] border border-[#e6dfd8] px-1.5 py-0.5 rounded bg-[#faf9f5] font-mono text-[#3d3d3a]">Ctrl+K</kbd>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-[#3d3d3a] hover:bg-[#efe9de]"
              onClick={() => setIsSearchOpen(true)}
              title="Search System"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#cc785c] rounded-full" />
            </Button>
            <RoleSwitcher />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8 bg-[#faf9f5]">
          <Outlet />
        </main>
      </div>
      <QuickSearchModal isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <Toaster />
    </div>
  )
}
