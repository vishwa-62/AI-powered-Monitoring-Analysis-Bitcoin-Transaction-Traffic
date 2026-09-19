import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

let socket = null;

export function useWebSocket(onNewTx, onNewAlert) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      socket = io('http://localhost:5000', {
        transports: ['websocket', 'polling']
      });
    }

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    if (onNewTx) {
      socket.on('new_transaction', onNewTx);
    }

    if (onNewAlert) {
      socket.on('new_alert', onNewAlert);
    }

    return () => {
      if (onNewTx) socket.off('new_transaction', onNewTx);
      if (onNewAlert) socket.off('new_alert', onNewAlert);
    };
  }, [onNewTx, onNewAlert]);

  return { isConnected, socket };
}
