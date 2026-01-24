'use client';

import { useState, useEffect, useCallback } from 'react';
import TaskTerminal from '@/components/nutrikit/sprint/TaskTerminal';

interface TerminalSectionProps {
  taskIdentifier: string;
  taskTitle: string;
}

export default function TerminalSection({ taskIdentifier, taskTitle }: TerminalSectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/check-session');
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
    } catch (err) {
      console.error('Session check failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyWithTouchID = useCallback(async (): Promise<boolean> => {
    // Check if WebAuthn is supported
    if (!window.PublicKeyCredential) {
      // Fallback: just verify PIN without biometric
      return true;
    }

    try {
      // Check if platform authenticator (Touch ID/Face ID) is available
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        // No biometric available, just verify PIN
        return true;
      }

      // Create a simple challenge for user verification
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      // Request user verification (Touch ID/Face ID)
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: 'NutriKit Terminal',
            id: window.location.hostname,
          },
          user: {
            id: new Uint8Array(16),
            name: 'terminal-user',
            displayName: 'Terminal User',
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' },  // ES256
            { alg: -257, type: 'public-key' }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
        },
      });

      return !!credential;
    } catch (err) {
      // User cancelled or error - still allow if they entered correct PIN
      console.log('Touch ID verification skipped:', err);
      return true;
    }
  }, []);

  const handleVerifyPin = async () => {
    if (!pin.trim()) {
      setError('Please enter PIN');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // First verify with Touch ID
      const touchIdVerified = await verifyWithTouchID();
      if (!touchIdVerified) {
        setError('Biometric verification failed');
        setIsVerifying(false);
        return;
      }

      // Then verify PIN with server
      const res = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setShowPinInput(false);
        setPin('');
      } else {
        setError(data.error || 'Invalid PIN');
      }
    } catch (err) {
      console.error('Verification failed:', err);
      setError('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="glass rounded-2xl overflow-hidden mb-6 border border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                Claude Terminal
                <span className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse" />
              </h3>
              <p className="text-xs text-muted">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated - show terminal
  if (isAuthenticated) {
    return (
      <div className="relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 z-10 px-2 py-1 text-xs text-muted hover:text-foreground transition-colors"
        >
          Sign out
        </button>
        <TaskTerminal taskIdentifier={taskIdentifier} taskTitle={taskTitle} />
      </div>
    );
  }

  // PIN input mode
  if (showPinInput) {
    return (
      <div className="glass rounded-2xl overflow-hidden mb-6 border border-white/10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Enter PIN</h3>
              <p className="text-xs text-muted">Touch ID will verify it's you</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerifyPin()}
              placeholder="Enter PIN"
              className="flex-1 px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:border-accent/50"
              autoFocus
            />
            <button
              onClick={handleVerifyPin}
              disabled={isVerifying}
              className="px-4 py-2 bg-accent/20 text-accent rounded-lg text-sm font-medium hover:bg-accent/30 transition-colors disabled:opacity-50"
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              ) : (
                'Verify'
              )}
            </button>
            <button
              onClick={() => {
                setShowPinInput(false);
                setPin('');
                setError('');
              }}
              className="px-4 py-2 text-muted hover:text-foreground transition-colors text-sm"
            >
              Cancel
            </button>
          </div>

          {error && (
            <p className="mt-2 text-xs text-red-400">{error}</p>
          )}
        </div>
      </div>
    );
  }

  // Not authenticated - show connect button
  return (
    <div className="glass rounded-2xl overflow-hidden mb-6 border border-white/10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              Claude Terminal
              <span className="w-2 h-2 rounded-full bg-zinc-500" />
            </h3>
            <p className="text-xs text-muted">Authenticate to access</p>
          </div>
        </div>
        <button
          onClick={() => setShowPinInput(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent rounded-lg font-medium text-sm hover:bg-accent/30 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Connect
        </button>
      </div>
    </div>
  );
}
