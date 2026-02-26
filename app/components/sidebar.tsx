'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
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
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const recentDocuments = documents.slice(0, 10)

  if (isCollapsed) {
    return (
      <div className="w-16 bg-tertiary flex flex-col items-center py-4 gap-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 hover:bg-gray-200 rounded"
          title="Expand sidebar"
        >
          →
        </button>
      </div>
    )
  }

  return (
    <div className="w-64 bg-secondary flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg">aegis</h2>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-gray-200 rounded"
          title="Collapse sidebar"
        >
          ←
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="px-4 py-3 flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Go back"
        >
          ←
        </button>
        <button
          onClick={() => router.forward()}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Go forward"
        >
          →
        </button>
      </div>

      {/* User Account */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {userEmail[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Recent Pages */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="px-2 py-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-500 uppercase">
            Recent
          </h3>
          <span className="text-xs text-gray-400">{recentDocuments.length}</span>
        </div>
        <div className="space-y-1 mt-1">
          {recentDocuments.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-500">No documents yet</p>
          ) : (
            recentDocuments.map((doc) => {
              const isActive = pathname === `/documents/${doc.id}`
              return (
                <Link
                  key={doc.id}
                  href={`/documents/${doc.id}`}
                  className={`block px-3 py-2 rounded text-sm truncate hover:bg-gray-200 transition-colors ${
                    isActive ? 'bg-gray-200 font-medium' : ''
                  }`}
                  title={doc.title}
                >
                  📄 {doc.title}
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