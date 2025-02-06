
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Info } from 'lucide-react';
import { io } from 'socket.io-client';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoMetadata {
  title: string;
  duration: number;
  fileSize: number;
  format: string;
  resolution: string;
}

interface VideoPlayerProps {
  src: string;
  isAdmin?: boolean;
  metadata?: VideoMetadata;
}

export const VideoPlayer = ({ src, isAdmin = false, metadata }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
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
      setIsConnected(true);
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
        setIsPlaying(data.isPlaying);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [toast, isAdmin]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);

      if (isAdmin && isConnected) {
        socketRef.current?.emit('videoSync', {
          isPlaying: !video.paused,
          currentTime: video.currentTime,
        });
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, [isAdmin, isConnected]);

  const togglePlay = () => {
    if (!videoRef.current || !isAdmin) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);

    if (isAdmin && isConnected) {
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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
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
              disabled={!isAdmin && !isConnected}
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

          {metadata && (
            <button
              onClick={() => setShowMetadata(true)}
              className="text-white hover:text-primary/80 transition-colors"
            >
              <Info className="w-6 h-6" />
            </button>
          )}

          <button
            onClick={handleFullscreen}
            className="text-white hover:text-primary/80 transition-colors"
          >
            <Maximize className="w-6 h-6" />
          </button>
        </div>
      </div>

      {metadata && (
        <Dialog open={showMetadata} onOpenChange={setShowMetadata}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Video Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Title</p>
                <p className="text-sm text-muted-foreground">{metadata.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {formatDuration(metadata.duration)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">File Size</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(metadata.fileSize)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Format</p>
                <p className="text-sm text-muted-foreground">{metadata.format}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Resolution</p>
                <p className="text-sm text-muted-foreground">{metadata.resolution}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
