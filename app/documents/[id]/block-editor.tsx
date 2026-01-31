'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type BlockEditorProps = {
  blockId: string
  initialContent: string
  blockType: string
  onEnter: () => void
  onBackspace: () => void
  onUpdate: (content: string) => void
}

export function BlockEditor({
  blockId,
  initialContent,
  blockType,
  onEnter,
  onBackspace,
  onUpdate,
}: BlockEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const text = editor.getText()
      onUpdate(text)
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[1.5rem] px-2 py-1',
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
          onEnter()
          return true
        }
        
        if (event.key === 'Backspace' && editor?.isEmpty) {
          event.preventDefault()
          onBackspace()
          return true
        }
        
        return false
      },
    },
  })

  return (
    <div className="block-editor group relative hover:bg-gray-50 rounded transition-colors">
      <EditorContent editor={editor} />
      {editor?.isEmpty && (
        <div className="absolute left-2 top-1 text-gray-400 pointer-events-none">
          Type '/' for commands...
        </div>
      )}
    </div>
  )
}