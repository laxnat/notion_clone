import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogoutButton } from './logout-button'
import { CreateDocumentButton } from './create-document-button'
import { PrismaClient, Document } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function DocumentsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const documents = await prisma.document.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Documents</h1>
          <div className="flex gap-4">
            <CreateDocumentButton />
            <LogoutButton />
          </div>
        </div>
        
        <div className="space-y-4">
          {documents.length === 0 ? (
            <p className="text-gray-500">No documents yet. Create your first one!</p>
          ) : (
            documents.map((doc: Document) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="block p-4 border rounded hover:bg-gray-50"
              >
                <h2 className="font-medium">{doc.title}</h2>
                <p className="text-sm text-gray-500">
                  Updated {new Date(doc.updatedAt).toLocaleDateString()}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}