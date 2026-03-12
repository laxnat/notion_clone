import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { HomeDashboard } from './home-dashboard'

const prisma = new PrismaClient()

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [folders, documents] = await Promise.all([
    prisma.folder.findMany({
      where: { userId: user.id, parentId: null },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { documents: true } },
        documents: {
          select: { id: true, title: true, updatedAt: true },
          orderBy: { updatedAt: 'desc' },
        },
        children: {
          orderBy: { updatedAt: 'desc' },
          include: { _count: { select: { documents: true } } },
        },
      },
    }),
    prisma.document.findMany({
      where: { userId: user.id, folderId: null },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, updatedAt: true },
    }),
  ])

  const folderData = folders.map(f => ({
    id: f.id,
    name: f.name,
    updatedAt: f.updatedAt.toISOString(),
    docCount: f._count.documents,
    documents: f.documents.map(d => ({
      id: d.id,
      title: d.title,
      updatedAt: d.updatedAt.toISOString(),
    })),
    subFolders: f.children.map(c => ({
      id: c.id,
      name: c.name,
      docCount: c._count.documents,
      updatedAt: c.updatedAt.toISOString(),
    })),
  }))

  const docData = documents.map(d => ({
    id: d.id,
    title: d.title,
    updatedAt: d.updatedAt.toISOString(),
  }))

  return (
    <div className="p-8 pt-6">
      <div className="max-w-4xl mx-auto">
        <HomeDashboard initialFolders={folderData} initialDocs={docData} />
      </div>
    </div>
  )
}
