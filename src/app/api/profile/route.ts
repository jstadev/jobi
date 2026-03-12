import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// GET /api/profile - get current user's full profile
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  if (profile?.role === 'employer') {
    const { data: company } = await supabase
      .from('companies').select('*').eq('user_id', user.id).single()
    return NextResponse.json({ profile, company })
  }

  if (profile?.role === 'candidate') {
    const { data: candidate } = await supabase
      .from('candidate_profiles').select('*').eq('id', user.id).single()
    return NextResponse.json({ profile, candidate })
  }

  return NextResponse.json({ profile })
}

// PUT /api/profile - update profile
export async function PUT(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, phone, location, bio, website, avatar_url, ...roleData } = body

  // Update base profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ name, phone, location, bio, website, avatar_url })
    .eq('id', user.id)

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  // Update role-specific data
  if (profile?.role === 'employer' && Object.keys(roleData).length > 0) {
    const { name: companyName, logo_url, description, founded_year, company_size, industry } = roleData
    await supabase.from('companies').upsert({
      user_id: user.id,
      name: companyName,
      logo_url, description, founded_year, company_size, industry,
      location,
    })
  }

  if (profile?.role === 'candidate' && Object.keys(roleData).length > 0) {
    const { title, skills, experience, qualification, salary_min, salary_max, salary_duration, resume_url, english_fluency } = roleData
    await supabase.from('candidate_profiles').upsert({
      id: user.id,
      title, skills, experience, qualification,
      salary_min, salary_max, salary_duration,
      resume_url, english_fluency,
    })
  }

  return NextResponse.json({ success: true })
}
