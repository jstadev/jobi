import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// GET /api/jobs/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      companies (id, name, logo_url, location, description, website),
      profiles!posted_by (id, name, avatar_url)
    `)
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

  return NextResponse.json({ job: data })
}

// PUT /api/jobs/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: job } = await supabase.from('jobs').select('posted_by').eq('id', params.id).single()
  if (job?.posted_by !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const { data, error } = await supabase
    .from('jobs').update(body).eq('id', params.id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ job: data })
}

// DELETE /api/jobs/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: job } = await supabase.from('jobs').select('posted_by').eq('id', params.id).single()
  if (job?.posted_by !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { error } = await supabase.from('jobs').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
