'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTerminalSocket, ConnectionStatus, SessionInfo } from './useTerminalSocket';
import '@xterm/xterm/css/xterm.css';

interface TerminalViewerProps {
  className?: string;
  autoConnect?: boolean;
  showHeader?: boolean;
}

export default function TerminalViewer({
  className = '',
  autoConnect = true,
  showHeader = true,
}: TerminalViewerProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<import('@xterm/xterm').Terminal | null>(null);
  const fitAddonRef = useRef<import('@xterm/addon-fit').FitAddon | null>(null);

  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [statusMessage, setStatusMessage] = useState('');
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Socket handlers
  const handleOutput = useCallback((data: string) => {
    terminalInstanceRef.current?.write(data);
  }, []);

  const handleHistory = useCallback((data: string) => {
    terminalInstanceRef.current?.write(data);
  }, []);

  const handleStatus = useCallback((newStatus: ConnectionStatus, message?: string) => {
    setStatus(newStatus);
    setStatusMessage(message || '');
  }, []);

  const handleSessionInfo = useCallback((info: SessionInfo) => {
    setSessionInfo(info);
  }, []);

  const handleControllerLeft = useCallback(() => {
    setStatusMessage('Controller disconnected');
  }, []);

  const { connect, disconnect, isConnected } = useTerminalSocket({
    mode: 'viewer',
    onOutput: handleOutput,
    onHistory: handleHistory,
    onStatus: handleStatus,
    onSessionInfo: handleSessionInfo,
    onControllerLeft: handleControllerLeft,
  });

  // Initialize terminal
  const initializeTerminal = useCallback(async () => {
    if (isInitialized || !terminalRef.current) return;

    try {
      const { Terminal } = await import('@xterm/xterm');
      const { FitAddon } = await import('@xterm/addon-fit');
      const { WebLinksAddon } = await import('@xterm/addon-web-links');

      // Dracula-inspired theme (same as TaskTerminal)
      const terminal = new Terminal({
        cursorBlink: false, // No cursor for read-only viewer
        cursorStyle: 'bar',
        cursorInactiveStyle: 'none',
        fontSize: 13,
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
        lineHeight: 1.3,
        letterSpacing: 0,
        theme: {
          background: '#0a0a0f',
          foreground: '#f8f8f2',
          cursor: '#f8f8f2',
          cursorAccent: '#0a0a0f',
          selectionBackground: 'rgba(189, 147, 249, 0.4)',
          selectionForeground: '#ffffff',
          black: '#21222c',
          red: '#ff5555',
          green: '#50fa7b',
          yellow: '#f1fa8c',
          blue: '#6272a4',
          magenta: '#ff79c6',
          cyan: '#8be9fd',
          white: '#f8f8f2',
          brightBlack: '#6272a4',
          brightRed: '#ff6e6e',
          brightGreen: '#69ff94',
          brightYellow: '#ffffa5',
          brightBlue: '#d6acff',
          brightMagenta: '#ff92df',
          brightCyan: '#a4ffff',
          brightWhite: '#ffffff',
        },
        allowProposedApi: true,
        scrollback: 10000,
        disableStdin: true, // Read-only - no input
      });

      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();

      terminal.loadAddon(fitAddon);
      terminal.loadAddon(webLinksAddon);

      terminal.open(terminalRef.current);
      fitAddon.fit();

      terminalInstanceRef.current = terminal;
      fitAddonRef.current = fitAddon;
      setIsInitialized(true);

      // Handle window resize
      const handleResize = () => {
        if (fitAddonRef.current) {
          fitAddonRef.current.fit();
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } catch (error) {
      console.error('Failed to initialize terminal:', error);
      setStatus('error');
      setStatusMessage('Failed to load terminal');
    }
  }, [isInitialized]);

  // Initialize terminal on mount
  useEffect(() => {
    initializeTerminal();
  }, [initializeTerminal]);

  // Auto-connect when initialized
  useEffect(() => {
    if (isInitialized && autoConnect && status === 'disconnected') {
      connect();
    }
  }, [isInitialized, autoConnect, status, connect]);

  // Fit terminal when container resizes
  useEffect(() => {
    if (fitAddonRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        fitAddonRef.current?.fit();
      });

      if (terminalRef.current) {
        resizeObserver.observe(terminalRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [isInitialized]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
      terminalInstanceRef.current?.dispose();
    };
  }, [disconnect]);

  // Status indicator
  const getStatusConfig = () => {
    if (!sessionInfo?.active && status === 'connected') {
      return {
        color: 'bg-zinc-500',
        text: 'Waiting for session...',
        showLive: false,
      };
    }

    switch (status) {
      case 'disconnected':
        return { color: 'bg-zinc-500', text: 'Disconnected', showLive: false };
      case 'connecting':
        return { color: 'bg-yellow-500 animate-pulse', text: 'Connecting...', showLive: false };
      case 'connected':
        return {
          color: sessionInfo?.hasController ? 'bg-red-500' : 'bg-green-500',
          text: sessionInfo?.hasController ? 'Live' : 'Connected (no controller)',
          showLive: sessionInfo?.hasController ?? false,
        };
      case 'error':
        return { color: 'bg-red-500', text: statusMessage || 'Error', showLive: false };
      default:
        return { color: 'bg-zinc-500', text: 'Unknown', showLive: false };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`flex flex-col ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-2 bg-black/50 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            {statusConfig.showLive && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/20 rounded text-xs font-medium text-red-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                LIVE
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
              <span className="text-xs text-muted">{statusConfig.text}</span>
            </div>

            {/* Task identifier */}
            {sessionInfo?.taskIdentifier && (
              <span className="text-xs text-protein font-medium">
                {sessionInfo.taskIdentifier}
              </span>
            )}
          </div>

          {/* Viewer count */}
          {sessionInfo && sessionInfo.viewerCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {sessionInfo.viewerCount}
            </div>
          )}

          {/* Reconnect button (only when disconnected) */}
          {status === 'disconnected' && (
            <button
              onClick={connect}
              className="px-3 py-1 rounded text-xs bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
            >
              Connect
            </button>
          )}
        </div>
      )}

      {/* Terminal container */}
      <div
        ref={terminalRef}
        className="flex-1 bg-[#0a0a0f] min-h-[300px]"
        style={{ padding: '12px' }}
      />

      {/* Read-only notice */}
      <div className="px-4 py-1.5 bg-black/30 border-t border-white/5 text-xs text-muted text-center">
        Read-only view &mdash; watching live terminal session
      </div>
    </div>
  );
}
