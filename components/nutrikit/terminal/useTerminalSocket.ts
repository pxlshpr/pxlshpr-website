'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// WebSocket server URL - configurable via env or default to localhost
const TERMINAL_SERVER_URL = process.env.NEXT_PUBLIC_TERMINAL_SERVER_URL || 'ws://localhost:3001';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface SessionInfo {
  hasController: boolean;
  viewerCount: number;
  active: boolean;
  taskIdentifier: string | null;
}

export interface UseTerminalSocketOptions {
  mode: 'controller' | 'viewer';
  token?: string;
  taskIdentifier?: string;
  onOutput: (data: string) => void;
  onHistory: (data: string) => void;
  onStatus: (status: ConnectionStatus, message?: string) => void;
  onSessionInfo: (info: SessionInfo) => void;
  onControllerLeft?: () => void;
  onError?: (code: string, message: string) => void;
}

export interface UseTerminalSocketReturn {
  connect: () => void;
  disconnect: () => void;
  sendInput: (data: string) => void;
  sendResize: (cols: number, rows: number) => void;
  isConnected: boolean;
  assignedMode: 'controller' | 'viewer' | null;
}

export function useTerminalSocket(options: UseTerminalSocketOptions): UseTerminalSocketReturn {
  const {
    mode,
    token,
    taskIdentifier,
    onOutput,
    onHistory,
    onStatus,
    onSessionInfo,
    onControllerLeft,
    onError,
  } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [assignedMode, setAssignedMode] = useState<'controller' | 'viewer' | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear all intervals and timeouts
  const clearTimers = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    onStatus('connecting');

    const ws = new WebSocket(TERMINAL_SERVER_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected, sending handshake');
      // Send handshake
      ws.send(JSON.stringify({
        type: 'connect',
        mode,
        token,
        taskIdentifier,
      }));

      // Start ping interval
      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        switch (msg.type) {
          case 'connected':
            console.log('Handshake complete, assigned mode:', msg.mode);
            setIsConnected(true);
            setAssignedMode(msg.mode);
            onStatus('connected');
            break;

          case 'history':
            onHistory(msg.data);
            break;

          case 'output':
            onOutput(msg.data);
            break;

          case 'status':
            if (msg.status === 'error' || msg.status === 'disconnected') {
              onStatus(msg.status as ConnectionStatus, msg.message);
            } else if (msg.status === 'connected' || msg.status === 'connecting') {
              onStatus(msg.status as ConnectionStatus, msg.message);
            }
            break;

          case 'session-info':
            onSessionInfo({
              hasController: msg.hasController,
              viewerCount: msg.viewerCount,
              active: msg.active,
              taskIdentifier: msg.taskIdentifier,
            });
            break;

          case 'controller-left':
            onControllerLeft?.();
            break;

          case 'error':
            console.warn('Server error:', msg.code, msg.message);
            onError?.(msg.code, msg.message);
            // If auth failed and we were trying to be controller, we're now a viewer
            if (msg.code === 'AUTH_FAILED' || msg.code === 'CONTROLLER_EXISTS') {
              setAssignedMode('viewer');
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
      setIsConnected(false);
      setAssignedMode(null);
      onStatus('disconnected');
      wsRef.current = null;
      clearTimers();
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      onStatus('error', 'Connection error');
    };
  }, [mode, token, taskIdentifier, onOutput, onHistory, onStatus, onSessionInfo, onControllerLeft, onError, clearTimers]);

  const disconnect = useCallback(() => {
    clearTimers();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setAssignedMode(null);
    onStatus('disconnected');
  }, [clearTimers, onStatus]);

  const sendInput = useCallback((data: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && assignedMode === 'controller') {
      wsRef.current.send(JSON.stringify({ type: 'input', data }));
    }
  }, [assignedMode]);

  const sendResize = useCallback((cols: number, rows: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && assignedMode === 'controller') {
      wsRef.current.send(JSON.stringify({ type: 'resize', cols, rows }));
    }
  }, [assignedMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
      wsRef.current?.close();
    };
  }, [clearTimers]);

  return {
    connect,
    disconnect,
    sendInput,
    sendResize,
    isConnected,
    assignedMode,
  };
}
