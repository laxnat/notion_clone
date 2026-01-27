'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function CreateDocumentButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    setLoading(true)
    
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Untitled' }),
    })

    const document = await response.json()
    
    setLoading(false)
    router.push(`/documents/${document.id}`)
  }

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
    >
      {loading ? 'Creating...' : '+ New Document'}
    </button>
  )
}