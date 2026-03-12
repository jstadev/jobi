import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// PUT /api/applications/[id] - update status (employer only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { status } = await request.json()
  const validStatuses = ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  // Verify employer owns the job
  const { data: application } = await supabase
    .from('applications').select('job_id').eq('id', params.id).single()

  const { data: job } = await supabase
    .from('jobs').select('posted_by').eq('id', application?.job_id).single()

  if (job?.posted_by !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('applications').update({ status }).eq('id', params.id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ application: data })
}
