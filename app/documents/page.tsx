import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PrismaClient, Document } from '@prisma/client'
import Link from 'next/link'
import { CreateDocumentButton } from './create-document-button'

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
          <h1 className="text-3xl font-bold">All Documents</h1>
          <CreateDocumentButton />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.length === 0 ? (
            <p className="text-gray-500 col-span-full">No documents yet. Create your first one!</p>
          ) : (
            documents.map((doc: Document) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="block p-6 border rounded-lg hover:shadow-md hover:border-blue-400 transition-all"
              >
                <h2 className="font-medium text-lg mb-2 truncate">{doc.title}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}