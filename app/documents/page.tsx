import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogoutButton } from './logout-button'

export default async function DocumentsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Documents</h1>
          <LogoutButton />
        </div>
        <p className="text-gray-600">Welcome, {user.email}!</p>
        
        <div className="mt-8 text-gray-500">
          No documents yet. We'll add the ability to create them next!
        </div>
      </div>
    </div>
  )
}