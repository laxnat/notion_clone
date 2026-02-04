'use client'

import { Editor } from '@tiptap/react'

type EditorToolbarProps = {
  editor: Editor | null
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null
  }

  return (
    <div 
      className="border-b bg-gray-50 p-2 flex gap-1 flex-wrap sticky top-0 z-10"
      onMouseDown={(e) => e.preventDefault()}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1 rounded hover:bg-gray-200 font-bold ${
          editor.isActive('bold') ? 'bg-gray-300' : ''
        }`}
      >
        B
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1 rounded hover:bg-gray-200 italic ${
          editor.isActive('italic') ? 'bg-gray-300' : ''
        }`}
      >
        I
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-3 py-1 rounded hover:bg-gray-200 underline ${
          editor.isActive('underline') ? 'bg-gray-300' : ''
        }`}
      >
        U
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3 py-1 rounded hover:bg-gray-200 font-bold ${
          editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
        }`}
      >
        H1
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1 rounded hover:bg-gray-200 font-bold ${
          editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
        }`}
      >
        H2
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-3 py-1 rounded hover:bg-gray-200 font-bold ${
          editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
        }`}
      >
        H3
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-1 rounded hover:bg-gray-200 ${
          editor.isActive('bulletList') ? 'bg-gray-300' : ''
        }`}
      >
        • List
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-3 py-1 rounded hover:bg-gray-200 ${
          editor.isActive('orderedList') ? 'bg-gray-300' : ''
        }`}
      >
        1. List
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`px-3 py-1 rounded hover:bg-gray-200 font-mono ${
          editor.isActive('codeBlock') ? 'bg-gray-300' : ''
        }`}
      >
        {'</>'}
      </button>
    </div>
  )
}