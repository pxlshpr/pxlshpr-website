import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const TERMINAL_PIN = process.env.TERMINAL_PIN;
const TERMINAL_SESSION_SECRET = process.env.TERMINAL_SESSION_SECRET || 'default-secret-change-me';

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();

    console.log('[verify-pin] Received PIN length:', pin?.length);
    console.log('[verify-pin] Expected PIN length:', TERMINAL_PIN?.length);
    console.log('[verify-pin] PIN configured:', !!TERMINAL_PIN);
    console.log('[verify-pin] PINs match:', pin === TERMINAL_PIN);

    if (!TERMINAL_PIN) {
      console.log('[verify-pin] ERROR: PIN not configured in environment');
      return NextResponse.json(
        { error: 'PIN not configured' },
        { status: 500 }
      );
    }

    if (pin !== TERMINAL_PIN) {
      console.log('[verify-pin] ERROR: PIN mismatch');
      console.log('[verify-pin] Received:', JSON.stringify(pin));
      console.log('[verify-pin] Expected:', JSON.stringify(TERMINAL_PIN));
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      );
    }

    // Create a simple session token (timestamp + secret hash)
    const timestamp = Date.now();
    const encoder = new TextEncoder();
    const data = encoder.encode(`${timestamp}-${TERMINAL_SESSION_SECRET}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const token = `${timestamp}.${hashArray.map(b => b.toString(16).padStart(2, '0')).join('')}`;

    // Set session cookie (24 hour expiry)
    const cookieStore = await cookies();
    cookieStore.set('terminal-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PIN verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
