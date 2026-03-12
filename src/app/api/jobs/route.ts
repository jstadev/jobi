import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// GET /api/jobs - list jobs with filters
export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)

  const search = searchParams.get('search')
  const category = searchParams.get('category')
  const location = searchParams.get('location')
  const job_type = searchParams.get('job_type')
  const experience = searchParams.get('experience')
  const salary_min = searchParams.get('salary_min')
  const salary_max = searchParams.get('salary_max')
  const company = searchParams.get('company')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = (page - 1) * limit

  let query = supabase
    .from('jobs')
    .select(`
      *,
      companies (id, name, logo_url, location),
      profiles!posted_by (id, name, avatar_url)
    `, { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) query = query.ilike('title', `%${search}%`)
  if (location) query = query.ilike('location', `%${location}%`)
  if (job_type) query = query.eq('job_type', job_type)
  if (experience) query = query.eq('experience', experience)
  if (salary_min) query = query.gte('salary_min', Number(salary_min))
  if (salary_max) query = query.lte('salary_max', Number(salary_max))
  if (category) query = query.contains('categories', [category])
  if (company) query = query.ilike('companies.name', `%${company}%`)

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ jobs: data, total: count, page, limit })
}

// POST /api/jobs - create a job (employers only)
export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (profile?.role !== 'employer') {
    return NextResponse.json({ error: 'Only employers can post jobs' }, { status: 403 })
  }

  const { data: company } = await supabase
    .from('companies').select('id').eq('user_id', user.id).single()

  if (!company) {
    return NextResponse.json({ error: 'Create a company profile first' }, { status: 400 })
  }

  const body = await request.json()
  const {
    title, description, job_type, experience,
    salary_min, salary_max, salary_duration,
    location, country, city, state,
    categories, tags, english_fluency, deadline,
  } = body

  if (!title || !description) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
  }

  const { data, error } = await supabase.from('jobs').insert({
    title, description, job_type, experience,
    salary_min, salary_max, salary_duration,
    location, country, city, state,
    categories: categories || [],
    tags: tags || [],
    english_fluency,
    deadline,
    posted_by: user.id,
    company_id: company.id,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ job: data }, { status: 201 })
}
