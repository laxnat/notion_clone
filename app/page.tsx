import { createClient } from '@/lib/supabase/server'
import { LandingPage } from './landing-page'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userInfo = user
    ? {
        email: user.email ?? '',
        avatarUrl: user.user_metadata?.avatar_url ?? null,
      }
    : null

  return <LandingPage user={userInfo} />
}
