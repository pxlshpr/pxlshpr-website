import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

function getSupabase(): SupabaseClient {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

type BackgroundChoice = 'none' | 'particles' | 'lava' | 'crt' | 'glow' | 'aurora' | 'mesh'

const validChoices: BackgroundChoice[] = ['none', 'particles', 'lava', 'crt', 'glow', 'aurora', 'mesh']

async function getClientIp(): Promise<string> {
  const headersList = await headers()

  // Check various headers for the real IP (in order of preference)
  const forwardedFor = headersList.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = headersList.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Vercel-specific header
  const vercelForwardedFor = headersList.get('x-vercel-forwarded-for')
  if (vercelForwardedFor) {
    return vercelForwardedFor.split(',')[0].trim()
  }

  // Fallback
  return 'unknown'
}

// GET - Fetch current vote for this IP and all vote counts
export async function GET() {
  try {
    const supabase = getSupabase()
    const ip = await getClientIp()

    // Get user's current vote
    const { data: userVote } = await supabase
      .from('background_votes')
      .select('background_choice')
      .eq('ip_address', ip)
      .single()

    // Get vote counts for all options
    const { data: votes } = await supabase
      .from('background_votes')
      .select('background_choice')

    // Count votes per choice
    const counts: Record<string, number> = {}
    for (const choice of validChoices) {
      counts[choice] = 0
    }

    if (votes) {
      for (const vote of votes) {
        if (counts[vote.background_choice] !== undefined) {
          counts[vote.background_choice]++
        }
      }
    }

    return NextResponse.json({
      userChoice: userVote?.background_choice || null,
      counts,
      total: votes?.length || 0
    })
  } catch (error) {
    console.error('Error fetching votes:', error)
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 })
  }
}

// POST - Submit or update a vote
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const ip = await getClientIp()
    const body = await request.json()
    const choice = body.choice as BackgroundChoice

    if (!validChoices.includes(choice)) {
      return NextResponse.json({ error: 'Invalid choice' }, { status: 400 })
    }

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('background_votes')
      .select('id')
      .eq('ip_address', ip)
      .single()

    if (existingVote) {
      // Update existing vote
      await supabase
        .from('background_votes')
        .update({
          background_choice: choice,
          updated_at: new Date().toISOString()
        })
        .eq('ip_address', ip)
    } else {
      // Insert new vote
      await supabase
        .from('background_votes')
        .insert({
          ip_address: ip,
          background_choice: choice
        })
    }

    // Fetch updated counts
    const { data: votes } = await supabase
      .from('background_votes')
      .select('background_choice')

    const counts: Record<string, number> = {}
    for (const c of validChoices) {
      counts[c] = 0
    }

    if (votes) {
      for (const vote of votes) {
        if (counts[vote.background_choice] !== undefined) {
          counts[vote.background_choice]++
        }
      }
    }

    return NextResponse.json({
      success: true,
      userChoice: choice,
      counts,
      total: votes?.length || 0
    })
  } catch (error) {
    console.error('Error submitting vote:', error)
    return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 })
  }
}
