'use client'

import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type DocumentMenuProps = {
  documentId: string
  afterDelete?: () => void
  onOpenChange?: (open: boolean) => void
}

export function DocumentMenu({ documentId, afterDelete, onOpenChange }: DocumentMenuProps) {
  const [open, setOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const setOpenWithCallback = (value: boolean) => {
    setOpen(value)
    onOpenChange?.(value)
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

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 4, left: rect.left })
    }
    setOpenWithCallback(!open)
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
          className="fixed w-36 bg-tertiary rounded border border-white/10 shadow-xl z-9999 py-1"
        >
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-2 px-3 py-2 font-ui text-lg text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors text-left"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>,
        document.body
      )}
    </div>
  )
}
