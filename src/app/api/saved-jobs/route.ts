import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// GET /api/saved-jobs
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('saved_jobs')
    .select(`
      *,
      jobs (
        id, title, job_type, location, salary_min, salary_max, salary_duration,
        created_at, categories, tags,
        companies (name, logo_url)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ saved_jobs: data })
}

// POST /api/saved-jobs - toggle save
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { job_id } = await request.json()
  if (!job_id) return NextResponse.json({ error: 'Job ID required' }, { status: 400 })

  // Check if already saved
  const { data: existing } = await supabase
    .from('saved_jobs').select('id').eq('user_id', user.id).eq('job_id', job_id).single()

  if (existing) {
    await supabase.from('saved_jobs').delete().eq('id', existing.id)
    return NextResponse.json({ saved: false })
  }

  await supabase.from('saved_jobs').insert({ user_id: user.id, job_id })
  return NextResponse.json({ saved: true }, { status: 201 })
}
