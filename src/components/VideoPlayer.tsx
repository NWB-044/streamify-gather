import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { io } from 'socket.io-client';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface VideoPlayerProps {
  src: string;
  isAdmin?: boolean;
}

export const VideoPlayer = ({ src, isAdmin = false }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    // Listen for video sync events
    socketRef.current.on('videoSync', (data: { 
      isPlaying: boolean; 
      currentTime: number;
    }) => {
      console.log('Received sync event:', data);
      if (videoRef.current) {
        videoRef.current.currentTime = data.currentTime;
        if (data.isPlaying) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
        setIsPlaying(data.isPlaying);
      }
    });

    // Handle connection events
    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
      toast({
        title: "Connected",
        description: "Successfully connected to stream",
      });
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      toast({
        title: "Disconnected",
        description: "Lost connection to stream",
        variant: "destructive",
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [toast]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);

      // If admin, sync video state with other viewers
      if (isAdmin) {
        socketRef.current?.emit('videoSync', {
          isPlaying: !video.paused,
          currentTime: video.currentTime,
        });
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, [isAdmin]);

  const togglePlay = () => {
    if (!videoRef.current || (!isAdmin && !socketRef.current?.connected)) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);

    // Only admin can control playback
    if (isAdmin) {
      socketRef.current?.emit('videoSync', {
        isPlaying: !isPlaying,
        currentTime: videoRef.current.currentTime,
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="video-player-container relative fade-in">
      <video
        ref={videoRef}
        className="w-full h-full rounded-lg"
        src={src}
        onClick={isAdmin ? togglePlay : undefined}
      />
      <div className="video-controls absolute bottom-0 left-0 right-0 bg-black/60 p-4">
        <div className="flex items-center gap-4">
          {isAdmin && (
            <button
              onClick={togglePlay}
              className="text-white hover:text-primary/80 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
          )}
          <button
            onClick={toggleMute}
            className="text-white hover:text-primary/80 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>
          <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button
            onClick={handleFullscreen}
            className="text-white hover:text-primary/80 transition-colors"
          >
            <Maximize className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};