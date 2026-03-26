'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode, createElement } from 'react';
import { getToken, resolveApiBase } from '@/lib/api';

type WSEvent = { event: string; data?: Record<string, unknown> };

type WSContextValue = {
  lastEvent: WSEvent | null;
  connected: boolean;
};

const WSContext = createContext<WSContextValue>({ lastEvent: null, connected: false });

const MAX_BACKOFF_MS = 30_000;

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [lastEvent, setLastEvent] = useState<WSEvent | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const retriesRef = useRef(0);
  const unmountedRef = useRef(false);

  useEffect(() => {
    unmountedRef.current = false;

    function connect() {
      const token = getToken();
      if (!token) return;

      const apiBase = resolveApiBase();
      const wsProto = apiBase.startsWith('https') ? 'wss' : 'ws';
      const host = apiBase.replace(/^https?:\/\//, '');
      const url = `${wsProto}://${host}/ws?token=${encodeURIComponent(token)}`;

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (unmountedRef.current) { ws.close(); return; }
        setConnected(true);
        retriesRef.current = 0;
      };

      ws.onmessage = (evt) => {
        try {
          const parsed: WSEvent = JSON.parse(evt.data);
          if (parsed.event === 'ping') return;
          setLastEvent(parsed);
        } catch {
          // ignore non-JSON
        }
      };

      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;
        if (unmountedRef.current) return;
        const delay = Math.min(1000 * Math.pow(2, retriesRef.current), MAX_BACKOFF_MS);
        retriesRef.current += 1;
        setTimeout(() => { if (!unmountedRef.current) connect(); }, delay);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      unmountedRef.current = true;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return createElement(WSContext.Provider, { value: { lastEvent, connected } }, children);
}

export function useWS(): WSContextValue {
  return useContext(WSContext);
}
