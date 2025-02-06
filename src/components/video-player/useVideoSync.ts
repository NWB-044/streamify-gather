
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useToast } from '@/components/ui/use-toast';

export const useVideoSync = (isAdmin: boolean, videoRef: React.RefObject<HTMLVideoElement>) => {
  const socketRef = useRef<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    socketRef.current = io('http://localhost:3001', {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
      toast({
        title: "Connected",
        description: "Successfully connected to stream",
      });

      if (!isAdmin) {
        socketRef.current?.emit('requestSync');
      }
    });

    socketRef.current.on('connect_error', (error: Error) => {
      console.error('Connection error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to stream server",
        variant: "destructive",
      });
    });

    socketRef.current.on('videoSync', (data: { 
      isPlaying: boolean; 
      currentTime: number;
    }) => {
      if (!isAdmin && videoRef.current) {
        const timeDiff = Math.abs(videoRef.current.currentTime - data.currentTime);
        if (timeDiff > 0.5) {
          videoRef.current.currentTime = data.currentTime;
        }
        
        if (data.isPlaying) {
          videoRef.current.play().catch(console.error);
        } else {
          videoRef.current.pause();
        }
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [toast, isAdmin, videoRef]);

  return socketRef;
};
