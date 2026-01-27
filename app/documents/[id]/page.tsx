import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'

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

  // Document doesn't exist
  if (!document) {
    notFound()
  }

  // Document exists but doesn't belong to this user
  if (document.userId !== user.id) {
    notFound()
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{document.title}</h1>
        
        {document.blocks.length === 0 ? (
          <p className="text-gray-500">No content yet. Start typing!</p>
        ) : (
          <div className="space-y-4">
            {document.blocks.map((block) => (
              <div key={block.id} className="p-4 border rounded">
                <p className="text-sm text-gray-500 mb-2">Type: {block.type}</p>
                <p>{block.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}