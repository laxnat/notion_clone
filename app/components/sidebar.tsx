'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronLeft, House, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { LogoutButton } from '../documents/logout-button'

type Document = {
  id: string
  title: string
  updatedAt: Date
}

type SidebarProps = {
  documents: Document[]
  userEmail: string
}

export function Sidebar({ documents, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [collapseY, setCollapseY] = useState(24)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const recentDocuments = documents.slice(0, 10)

  if (isCollapsed) {
    return (
      <div className="w-16 bg-tertiary flex flex-col items-center py-4 gap-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 hover:bg-gray-200 rounded"
          title="Expand sidebar"
        >
          <PanelLeftOpen size={16} />
        </button>
        <Link
          href="/documents"
          className="p-2 hover:bg-gray-200 rounded"
          title="All documents"
        >
          <House size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div
      ref={sidebarRef}
      onMouseMove={(e) => {
        const rect = sidebarRef.current?.getBoundingClientRect()
        if (rect) setCollapseY(e.clientY - rect.top)
      }}
      className="w-64 bg-tertiary border-r border-gray flex flex-col h-screen relative group/sidebar"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-6xl">aegis</h2>

          {/* Avatar + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((v) => !v)}
              className="flex items-center gap-1"
              title={userEmail}
            >
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-display text-2xl">
                {userEmail[0].toUpperCase()}
              </div>
              <ChevronDown size={14} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-primary border rounded-lg shadow-lg z-50 py-1">
                <p className="px-3 py-2 text-md text-white truncate border-b">{userEmail}</p>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile Settings
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Collapse button on border */}
      <button
        onClick={() => setIsCollapsed(true)}
        style={{ top: collapseY - 12 }}
        className="absolute -right-3 z-10 w-6 h-6 bg-tertiary hover:bg-primary border rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover/sidebar:opacity-100 transition-opacity"
        title="Collapse sidebar"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Home */}
      <div className="px-3 py-1">
        <Link
          href="/documents"
          className={`flex items-center gap-3 px-3 rounded font-display text-4xl transition-colors hover:line-through hover:decoration-primary hover:decoration-8  ${
            pathname === '/documents' ? 'bg-primary italic' : ''
          }`}
        >
          Home
        </Link>
      </div>

      {/* Recent Pages */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="px-2 py-2 flex items-center justify-between">
          <h3 className="text-6xl font-display text-primary">
            Recents
          </h3>
          <span className="text-6xl font-display text-highlight">{recentDocuments.length}</span>
        </div>
        <div className="space-y-1">
          {recentDocuments.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-500">No documents yet</p>
          ) : (
            recentDocuments.map((doc) => {
              const isActive = pathname === `/documents/${doc.id}`
              return (
                <Link
                  key={doc.id}
                  href={`/documents/${doc.id}`}
                  className={`block px-3 py-2 rounded text-4xl font-display truncate  hover:line-through hover:decoration-primary hover:decoration-8 transition-colors ${
                    isActive ? 'bg-primary italic' : ''
                  }`}
                  title={doc.title}
                >
                  {doc.title}
                </Link>
              )
            })
          )}
        </div>
      </div>

      {/* Logout Section */}
      <div className="p-4">
        <LogoutButton />
      </div>
    </div>
  )
}