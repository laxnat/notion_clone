'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Folder, FolderOpen, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Props = {
  id: string
  name: string
  docCount: number
  relativeTime: string
}

export function FolderCard({ id, name, docCount, relativeTime }: Props) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [renameVal, setRenameVal] = useState(name)
  const [hovered, setHovered] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (renaming) setTimeout(() => inputRef.current?.select(), 0)
  }, [renaming])

  useEffect(() => {
    if (!menuOpen) return
    function handleOut(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleOut)
    return () => document.removeEventListener('mousedown', handleOut)
  }, [menuOpen])

  const openMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 4, left: r.left })
    }
    setMenuOpen(v => !v)
  }

  const handleRename = async () => {
    const trimmed = renameVal.trim()
    setRenaming(false)
    if (!trimmed || trimmed === name) return
    await fetch(`/api/folders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed }),
    })
    router.refresh()
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    await fetch(`/api/folders/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  const btnCls = 'w-full flex items-center gap-2 px-3 py-1 font-ui text-lg text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left'

  return (
    <div
      className="relative group/card border border-white/8 bg-tertiary hover:border-primary/20 transition-colors rounded-lg flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/documents/folders/${id}`}
        className={`flex flex-col gap-3 p-4 flex-1 ${renaming ? 'pointer-events-none' : ''}`}
      >
        {/* Icon */}
        {hovered
          ? <FolderOpen size={28} className="text-primary/70 shrink-0" />
          : <Folder size={28} className="text-primary/40 shrink-0" />
        }

        {/* Name */}
        {renaming ? (
          <input
            ref={inputRef}
            value={renameVal}
            onChange={e => setRenameVal(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleRename()
              if (e.key === 'Escape') { setRenaming(false); setRenameVal(name) }
            }}
            onBlur={handleRename}
            onClick={e => e.stopPropagation()}
            className="w-full bg-white/5 border border-white/20 rounded px-2 py-0.5 font-ui text-xl text-white outline-none focus:border-primary/40 pointer-events-auto"
          />
        ) : (
          <p className="font-ui text-xl text-white truncate">{name}</p>
        )}

        {/* Meta */}
        <div className="mt-auto">
          <p className="font-ui text-sm text-white/30">
            {docCount} {docCount === 1 ? 'document' : 'documents'}
          </p>
          <p className="font-ui text-xs text-white/20 mt-0.5">{relativeTime}</p>
        </div>
      </Link>

      {/* Menu button */}
      <div className={`absolute top-3 right-3 transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'}`}>
        <button
          ref={btnRef}
          onClick={openMenu}
          className="p-1 rounded text-white/30 hover:text-white hover:bg-white/10 transition-colors"
          title="More options"
        >
          <MoreHorizontal size={15} />
        </button>
      </div>

      {menuOpen && typeof window !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          style={{ top: pos.top, left: pos.left }}
          className="fixed w-44 bg-tertiary rounded-xl border border-white/10 shadow-xl z-[9999] p-1.5"
        >
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(false); setRenameVal(name); setRenaming(true) }}
            className={btnCls}
          >
            <Pencil size={14} /> Rename
          </button>
          <div className="my-1 border-t border-white/5" />
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-2 px-3 py-1 font-ui text-lg text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors text-left"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>,
        document.body
      )}
    </div>
  )
}
