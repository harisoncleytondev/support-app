import { useEffect, useRef, useCallback } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";

type EventHandler = (data: any) => void;

export function useWebSocket(
  handlers: Record<string, EventHandler>,
  deps: any[] = [],
) {
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    wsRef.current = new WebSocket(WS_URL);

    wsRef.current.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        const handler = handlersRef.current[msg.event];
        if (handler) handler(msg.data);
      } catch {}
    };

    wsRef.current.onclose = () => {
      setTimeout(connect, 3000);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, deps);
}
