import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// GET /api/candidates - list candidates
export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)

  const search = searchParams.get('search')
  const location = searchParams.get('location')
  const experience = searchParams.get('experience')
  const skill = searchParams.get('skill')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const offset = (page - 1) * limit

  let query = supabase
    .from('candidate_profiles')
    .select(`
      *,
      profiles!id (id, name, email, avatar_url, location)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (experience) query = query.eq('experience', experience)
  if (skill) query = query.contains('skills', [skill])

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ candidates: data, total: count, page, limit })
}
