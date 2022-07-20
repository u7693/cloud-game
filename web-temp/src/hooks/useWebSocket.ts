import { useState, useEffect, useRef } from 'react';

type UseWebSocket = ({
  roomId, wid, zone,
}: {
  roomId: string;
  wid: string;
  zone: string;
}) => React.MutableRefObject<WebSocket | null>;

export const useWebSocket: UseWebSocket = ({
  roomId, wid, zone,
}) => {
  const ws = useRef<WebSocket | null>(null);

  const protocol = window.location.protocol !== 'https:' ? 'ws://' : 'wss://';
  // const { host } = window.location;
  const host = 'localhost:8000';
  const params = new URLSearchParams({ room_id: roomId, zone }).toString();
  const address = `${protocol}${host}/ws?${params}`;

  console.info(`[useWebSocket] connecting to ${address}`);
  useEffect(() => {
    console.info(`[ws] connecting to ${address}`);
    ws.current = new WebSocket(address);
    ws.current.onerror = (e) => {
      console.error('[ws] error:');
      console.table(e);
    }

    return () => {
      console.info(`[ws] closing connection to ${address}`);
      ws.current?.close();
    }
  }, [address]);

  return ws;
}

