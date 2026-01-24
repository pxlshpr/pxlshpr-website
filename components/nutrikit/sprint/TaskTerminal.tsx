'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import '@xterm/xterm/css/xterm.css';

// Terminal status type
type TerminalStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'starting-claude' | 'ready';

interface TaskTerminalProps {
  taskIdentifier: string;
  taskTitle: string;
}

// WebSocket server URL - configurable via env or default to localhost
const TERMINAL_SERVER_URL = process.env.NEXT_PUBLIC_TERMINAL_SERVER_URL || 'ws://localhost:3001';

export default function TaskTerminal({ taskIdentifier, taskTitle }: TaskTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<import('@xterm/xterm').Terminal | null>(null);
  const fitAddonRef = useRef<import('@xterm/addon-fit').FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const outputBufferRef = useRef<string>('');
  const startupPhaseRef = useRef<'init' | 'cd' | 'claude' | 'prompt' | 'done'>('init');
  const inputDisposableRef = useRef<{ dispose: () => void } | null>(null);

  const [status, setStatus] = useState<TerminalStatus>('disconnected');
  const [statusMessage, setStatusMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [assignedMode, setAssignedMode] = useState<'controller' | 'viewer' | null>(null);
  const [viewerCount, setViewerCount] = useState(0);

  // Claude command with the task identifier
  const claudeCommand = `claude --dangerously-skip-permissions`;
  const workingDir = '~/Developer/NutriKit';
  const taskPrompt = `let's work on ${taskIdentifier}`;

  // Get controller token
  const getControllerToken = useCallback(async (): Promise<string | undefined> => {
    try {
      const response = await fetch('/api/terminal/token');
      if (response.ok) {
        const data = await response.json();
        return data.token;
      }
    } catch (e) {
      console.error('Failed to get controller token:', e);
    }
    return undefined;
  }, []);

  // Send input to terminal
  const sendInput = useCallback((data: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && assignedMode === 'controller') {
      wsRef.current.send(JSON.stringify({ type: 'input', data }));
    }
  }, [assignedMode]);

  // Initialize terminal only when expanded
  const initializeTerminal = useCallback(async () => {
    if (isInitialized || !terminalRef.current) return;

    try {
      // Dynamically import xterm to avoid SSR issues
      const { Terminal } = await import('@xterm/xterm');
      const { FitAddon } = await import('@xterm/addon-fit');
      const { WebLinksAddon } = await import('@xterm/addon-web-links');

      // Dracula-inspired theme with vibrant syntax highlighting colors
      const terminal = new Terminal({
        cursorBlink: true,
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
          // Dracula colors for syntax highlighting
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
        if (fitAddonRef.current && terminalInstanceRef.current) {
          fitAddonRef.current.fit();
          // Send resize to WebSocket
          if (wsRef.current?.readyState === WebSocket.OPEN && assignedMode === 'controller') {
            wsRef.current.send(JSON.stringify({
              type: 'resize',
              cols: terminalInstanceRef.current.cols,
              rows: terminalInstanceRef.current.rows,
            }));
          }
        }
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } catch (error) {
      console.error('Failed to initialize terminal:', error);
      setStatus('error');
      setStatusMessage('Failed to load terminal');
    }
  }, [isInitialized, assignedMode]);

  // Handle automatic startup sequence
  const handleStartupSequence = useCallback((output: string) => {
    outputBufferRef.current += output;
    const buffer = outputBufferRef.current;
    const phase = startupPhaseRef.current;

    // Phase 1: Wait for gum choose project selector, press Enter to select NutriKit (first option)
    if (phase === 'init') {
      // Look for the gum choose menu (shows "Select project" or project names)
      if (buffer.includes('Select project') || buffer.includes('NutriKit')) {
        startupPhaseRef.current = 'cd';
        setStatusMessage('Selecting NutriKit project...');
        outputBufferRef.current = '';
        // Press Enter (carriage return) to select the first option (NutriKit)
        setTimeout(() => {
          sendInput('\r');
        }, 500);
      }
    }
    // Phase 2: Wait for project selection to complete (shows "Switched to"), then start Claude
    else if (phase === 'cd') {
      // After gum choose, fish will cd and show "→ Switched to NutriKit"
      if (buffer.includes('Switched to') || buffer.includes('NutriKit') && buffer.includes('→')) {
        startupPhaseRef.current = 'claude';
        setStatus('starting-claude');
        setStatusMessage('Starting Claude...');
        outputBufferRef.current = '';
        // Start Claude after a short delay
        setTimeout(() => {
          sendInput(`${claudeCommand}\r`);
        }, 800);
      }
    }
    // Phase 3: Wait for Claude to start (look for its prompt or welcome message)
    else if (phase === 'claude') {
      // Claude shows a welcome message or prompt when ready
      // Look for typical Claude indicators
      if (
        buffer.includes('What would you like to do?') ||
        buffer.includes('Claude Code') ||
        buffer.includes('How can I help') ||
        buffer.includes('Tips:') ||
        buffer.includes('cost and speed') ||
        buffer.length > 1000 // Fallback: if we've received substantial output
      ) {
        startupPhaseRef.current = 'prompt';
        setStatusMessage('Sending task prompt...');
        outputBufferRef.current = '';
        // Send the task prompt
        setTimeout(() => {
          sendInput(taskPrompt + '\r');
          startupPhaseRef.current = 'done';
          setStatus('ready');
          setStatusMessage('Claude is working on the task');
        }, 1000);
      }
    }
  }, [sendInput, claudeCommand, taskPrompt]);

  // Connect to terminal server
  const connect = useCallback(async () => {
    // Wait for terminal to be initialized first
    if (!terminalInstanceRef.current) {
      console.log('Terminal not initialized yet, waiting...');
      await initializeTerminal();
      // Check again after initialization
      if (!terminalInstanceRef.current) {
        console.error('Failed to initialize terminal');
        return;
      }
    }
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    // Reset startup sequence
    startupPhaseRef.current = 'init';
    outputBufferRef.current = '';
    setAssignedMode(null);

    setStatus('connecting');
    setStatusMessage('Connecting to terminal server...');

    // Get controller token
    const token = await getControllerToken();

    const ws = new WebSocket(TERMINAL_SERVER_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected, sending handshake');
      // Send handshake with controller mode and token
      ws.send(JSON.stringify({
        type: 'connect',
        mode: 'controller',
        token,
        taskIdentifier,
      }));

      // Send initial resize
      if (terminalInstanceRef.current) {
        ws.send(JSON.stringify({
          type: 'resize',
          cols: terminalInstanceRef.current.cols,
          rows: terminalInstanceRef.current.rows,
        }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        switch (msg.type) {
          case 'connected':
            console.log('Handshake complete, assigned mode:', msg.mode);
            setAssignedMode(msg.mode);
            if (msg.mode === 'viewer') {
              setStatusMessage('Connected as viewer (read-only)');
            }
            break;

          case 'history':
            // Write history to terminal for late joiners
            terminalInstanceRef.current?.write(msg.data);
            break;

          case 'output':
            terminalInstanceRef.current?.write(msg.data);
            // Handle startup sequence (only if we're controller and not done)
            if (assignedMode === 'controller' && startupPhaseRef.current !== 'done') {
              handleStartupSequence(msg.data);
            }
            break;

          case 'status':
            if (msg.status === 'connected' && startupPhaseRef.current === 'init') {
              setStatus('connecting');
              setStatusMessage('Shell connected, initializing...');
            } else if (msg.status === 'error' || msg.status === 'disconnected') {
              setStatus(msg.status as TerminalStatus);
              setStatusMessage(msg.message || '');
            }
            break;

          case 'session-info':
            setViewerCount(msg.viewerCount || 0);
            break;

          case 'error':
            console.warn('Server error:', msg.code, msg.message);
            if (msg.code === 'AUTH_FAILED') {
              setStatusMessage('Auth failed - connected as viewer');
            } else if (msg.code === 'CONTROLLER_EXISTS') {
              setStatusMessage('Another controller connected - viewing');
            }
            break;

          case 'pong':
            // Heartbeat response
            break;
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      setStatus('disconnected');
      setStatusMessage('Connection closed');
      wsRef.current = null;
      startupPhaseRef.current = 'init';
      setAssignedMode(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('error');
      setStatusMessage('Connection error');
    };

    // Handle terminal input (only if we become controller)
    if (inputDisposableRef.current) {
      inputDisposableRef.current.dispose();
    }
    inputDisposableRef.current = terminalInstanceRef.current.onData((data) => {
      if (ws.readyState === WebSocket.OPEN && assignedMode === 'controller') {
        ws.send(JSON.stringify({ type: 'input', data }));
      }
    });
  }, [handleStartupSequence, getControllerToken, taskIdentifier, assignedMode, initializeTerminal]);

  // Disconnect from terminal server
  const disconnect = useCallback(() => {
    if (inputDisposableRef.current) {
      inputDisposableRef.current.dispose();
      inputDisposableRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('disconnected');
    setStatusMessage('');
    startupPhaseRef.current = 'init';
    outputBufferRef.current = '';
    setAssignedMode(null);

    // Clear terminal
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.clear();
    }
  }, []);

  // Initialize terminal when expanded
  useEffect(() => {
    if (isExpanded && !isInitialized) {
      initializeTerminal();
    }
  }, [isExpanded, isInitialized, initializeTerminal]);

  // Fit terminal when expanded state changes
  useEffect(() => {
    if (isExpanded && fitAddonRef.current) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        fitAddonRef.current?.fit();
      }, 50);
    }
  }, [isExpanded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      inputDisposableRef.current?.dispose();
      wsRef.current?.close();
      terminalInstanceRef.current?.dispose();
    };
  }, []);

  // Status indicator color and text
  const statusConfig = {
    disconnected: { color: 'bg-zinc-500', text: 'Click to expand and connect' },
    connecting: { color: 'bg-yellow-500 animate-pulse', text: statusMessage || 'Connecting...' },
    connected: { color: 'bg-blue-500', text: statusMessage || 'Connected' },
    'starting-claude': { color: 'bg-purple-500 animate-pulse', text: statusMessage || 'Starting Claude...' },
    ready: { color: 'bg-green-500', text: 'Claude is working' },
    error: { color: 'bg-red-500', text: statusMessage || 'Error' },
  }[status];

  return (
    <div className="glass rounded-2xl overflow-hidden mb-6 border border-white/10">
      {/* Header - always visible */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              Claude Terminal
              <span className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
              {assignedMode === 'controller' && viewerCount > 0 && (
                <span className="text-xs text-muted font-normal flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {viewerCount}
                </span>
              )}
            </h3>
            <p className="text-xs text-muted">
              {statusConfig.text}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Connect/Disconnect button */}
          {isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (status !== 'disconnected') {
                  disconnect();
                } else {
                  connect();
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                status !== 'disconnected'
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-accent/20 text-accent hover:bg-accent/30'
              }`}
            >
              {status !== 'disconnected' ? 'Disconnect' : 'Connect & Start'}
            </button>
          )}

          {/* Expand/Collapse chevron */}
          <svg
            className={`w-5 h-5 text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Terminal container - shown when expanded */}
      {isExpanded && (
        <div className="border-t border-white/10">
          {/* Startup sequence info */}
          <div className="px-4 py-2 bg-black/30 border-b border-white/5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${status === 'disconnected' ? 'bg-zinc-600' : startupPhaseRef.current === 'init' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-muted">Select NutriKit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${startupPhaseRef.current === 'cd' ? 'bg-yellow-500 animate-pulse' : startupPhaseRef.current === 'claude' || startupPhaseRef.current === 'prompt' || startupPhaseRef.current === 'done' ? 'bg-green-500' : 'bg-zinc-600'}`} />
              <span className="text-muted">{claudeCommand}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${startupPhaseRef.current === 'claude' || startupPhaseRef.current === 'prompt' ? 'bg-yellow-500 animate-pulse' : startupPhaseRef.current === 'done' ? 'bg-green-500' : 'bg-zinc-600'}`} />
              <span className="text-protein font-medium">{taskPrompt}</span>
            </div>
          </div>

          {/* Terminal */}
          <div
            ref={terminalRef}
            className="h-[500px] bg-[#0a0a0f]"
            style={{ padding: '12px' }}
          />
        </div>
      )}
    </div>
  );
}
