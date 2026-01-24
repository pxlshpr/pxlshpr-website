import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const TERMINAL_SESSION_SECRET = process.env.TERMINAL_SESSION_SECRET || 'default-secret-change-me';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('terminal-session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false });
    }

    // Verify token format and age
    const [timestampStr, hash] = sessionToken.split('.');
    const timestamp = parseInt(timestampStr, 10);

    if (isNaN(timestamp)) {
      return NextResponse.json({ authenticated: false });
    }

    // Check if token is expired (24 hours)
    const age = Date.now() - timestamp;
    if (age > 24 * 60 * 60 * 1000) {
      return NextResponse.json({ authenticated: false });
    }

    // Verify hash
    const encoder = new TextEncoder();
    const data = encoder.encode(`${timestamp}-${TERMINAL_SESSION_SECRET}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const expectedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hash !== expectedHash) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
