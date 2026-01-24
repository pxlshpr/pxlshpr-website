import { NextResponse } from 'next/server';
import { auth } from '@/auth-nutrikit';

// Controller token - this should match TERMINAL_CONTROLLER_TOKEN in terminal-server
const CONTROLLER_TOKEN = process.env.TERMINAL_CONTROLLER_TOKEN;

export async function GET() {
  // Check if user is authenticated
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  // Check if user is in the allowlist
  if (!session.user.isAllowed) {
    return NextResponse.json(
      { error: 'Not authorized' },
      { status: 403 }
    );
  }

  // Return the controller token
  if (!CONTROLLER_TOKEN) {
    return NextResponse.json(
      { error: 'Controller token not configured' },
      { status: 500 }
    );
  }

  return NextResponse.json({ token: CONTROLLER_TOKEN });
}
