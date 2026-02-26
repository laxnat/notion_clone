import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import { EditableTitle } from './editable-title'
import { BlocksManager } from './blocks-manager'  // Add this

const prisma = new PrismaClient()

export default async function DocumentPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { id } = await params

  const document = await prisma.document.findUnique({
    where: { id },
    include: {
      blocks: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!document) {
    notFound()
  }

  if (document.userId !== user.id) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-4xl mx-auto">
        <EditableTitle initialTitle={document.title} documentId={document.id} />
        
        <div className="mt-8">
          <BlocksManager 
            documentId={document.id} 
            initialBlocks={document.blocks} 
          />
        </div>
      </div>
    </div>
  )
}