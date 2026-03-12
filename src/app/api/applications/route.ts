import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// GET /api/applications - get applications for current user
export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const { searchParams } = new URL(request.url)
  const job_id = searchParams.get('job_id')

  let query = supabase.from('applications').select(`
    *,
    jobs (id, title, location, job_type, companies (name, logo_url)),
    profiles!candidate_id (id, name, avatar_url, email)
  `).order('created_at', { ascending: false })

  if (profile?.role === 'candidate') {
    query = query.eq('candidate_id', user.id)
  } else if (profile?.role === 'employer') {
    if (job_id) {
      query = query.eq('job_id', job_id)
    } else {
      // Get all applications for employer's jobs
      const { data: jobs } = await supabase.from('jobs').select('id').eq('posted_by', user.id)
      const jobIds = jobs?.map(j => j.id) || []
      query = query.in('job_id', jobIds)
    }
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ applications: data })
}

// POST /api/applications - apply for a job
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'candidate') {
    return NextResponse.json({ error: 'Only candidates can apply for jobs' }, { status: 403 })
  }

  const { job_id, cover_letter, resume_url } = await request.json()
  if (!job_id) return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })

  const { data, error } = await supabase.from('applications').insert({
    job_id,
    candidate_id: user.id,
    cover_letter,
    resume_url,
  }).select().single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Already applied to this job' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ application: data }, { status: 201 })
}
