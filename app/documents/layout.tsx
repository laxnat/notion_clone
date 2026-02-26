import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { Sidebar } from '../components/sidebar'

const prisma = new PrismaClient()

export default async function DocumentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    take: 10, // Only get 10 most recent
  })

  return (
    <div className="flex h-screen">
      <Sidebar
        documents={documents}
        userEmail={user.email || ''}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}