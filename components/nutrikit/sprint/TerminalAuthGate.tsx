'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { ReactNode, useState } from "react";

interface TerminalAuthGateProps {
  children: ReactNode;
  onAuthSuccess?: () => void;
}

export default function TerminalAuthGate({ children, onAuthSuccess }: TerminalAuthGateProps) {
  const { data: session, status } = useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn("apple", { callbackUrl: window.location.href });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: window.location.href });
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
        <p className="text-sm text-muted font-mono">Checking authentication...</p>
      </div>
    );
  }

  // Not authenticated - show sign in button
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center mb-6 shadow-lg">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
        <p className="text-sm text-muted text-center mb-6 max-w-sm">
          Sign in with your Apple ID to access the terminal. Touch ID or Face ID will be used for verification.
        </p>
        <button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-xl font-medium text-sm hover:bg-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
        >
          {isSigningIn ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Sign in with Apple
            </>
          )}
        </button>
      </div>
    );
  }

  // Authenticated but not allowed
  if (!session.user.isAllowed) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-red-400">Access Denied</h3>
        <p className="text-sm text-muted text-center mb-2 max-w-sm">
          Your Apple ID is not authorized to access the terminal.
        </p>
        <p className="text-xs text-muted/60 text-center mb-6 font-mono">
          Signed in as: {session.user.email || 'Unknown'}
        </p>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors font-mono"
        >
          Sign out
        </button>
      </div>
    );
  }

  // Authenticated and allowed - render children
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2 bg-green-500/10 border-b border-green-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs font-mono text-green-400">
            Authenticated as {session.user.email || session.user.name || 'Unknown'}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="text-xs text-muted hover:text-foreground transition-colors font-mono"
        >
          Sign out
        </button>
      </div>
      {children}
    </div>
  );
}
