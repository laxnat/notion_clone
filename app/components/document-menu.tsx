'use client'

import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MoreHorizontal, Trash2, Pencil, Copy } from 'lucide-react'
import { useRouter } from 'next/navigation'

type DocumentMenuProps = {
  documentId: string
  title: string
  afterDelete?: () => void
  onOpenChange?: (open: boolean) => void
}

export function DocumentMenu({ documentId, title, afterDelete, onOpenChange }: DocumentMenuProps) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'menu' | 'rename'>('menu')
  const [renameValue, setRenameValue] = useState(title)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const renameInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const setOpenWithCallback = (value: boolean) => {
    setOpen(value)
    onOpenChange?.(value)
    if (!value) setMode('menu')
  }

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpenWithCallback(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  useEffect(() => {
    if (mode === 'rename') {
      setTimeout(() => renameInputRef.current?.select(), 0)
    }
  }, [mode])

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 4, left: rect.left })
    }
    setRenameValue(title)
    setOpenWithCallback(!open)
  }

  const handleRename = async () => {
    const trimmed = renameValue.trim()
    if (!trimmed || trimmed === title) {
      setOpenWithCallback(false)
      return
    }
    setOpenWithCallback(false)
    await fetch(`/api/documents/${documentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: trimmed }),
    })
    router.refresh()
  }

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenWithCallback(false)
    await fetch(`/api/documents/${documentId}`, { method: 'POST' })
    router.refresh()
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenWithCallback(false)
    await fetch(`/api/documents/${documentId}`, { method: 'DELETE' })
    if (afterDelete) {
      afterDelete()
    } else {
      router.push('/documents')
      router.refresh()
    }
  }

  const btnClass = 'w-full flex items-center gap-2 px-3 py-1 font-ui text-lg text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left'

  return (
    <div className="relative" onClick={(e) => e.preventDefault()}>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="p-1 rounded text-white/30 hover:text-white hover:bg-white/10 transition-colors"
        title="More options"
      >
        <MoreHorizontal size={15} />
      </button>

      {open && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
          className="fixed w-60 bg-tertiary rounded-xl border border-white/10 shadow-xl z-9999 p-1.5"
        >
          {mode === 'rename' ? (
            <div className="px-2">
              <input
                ref={renameInputRef}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename()
                  if (e.key === 'Escape') setOpenWithCallback(false)
                }}
                onBlur={handleRename}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 font-ui text-lg text-white outline-none focus:border-white/25"
              />
            </div>
          ) : (
            <>
              <div className='w-full flex items-center gap-2 px-3 py-1 font-ui text-lg text-white/70 rounded-lg transition-colors text-left'>
                Panel
              </div>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMode('rename') }}
                className={btnClass}
              >
                <Pencil size={14} />
                Rename
              </button>
              <button onClick={handleDuplicate} className={btnClass}>
                <Copy size={14} />
                Duplicate
              </button>
              <div className="my-1 border-t border-white/5" />
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-3 py-1 font-ui text-lg text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors text-left"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}
