
import React, { useState, useRef, useEffect } from 'react';
import { VideoControls } from './video-player/VideoControls';
import { VideoMetadataDialog } from './video-player/VideoMetadataDialog';
import { useVideoSync } from './video-player/useVideoSync';
import { cn } from '@/lib/utils';

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
  const [showMetadata, setShowMetadata] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useVideoSync(isAdmin, videoRef);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);

      if (isAdmin && socketRef.current?.connected) {
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
    if (!videoRef.current || !isAdmin) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);

    if (isAdmin && socketRef.current?.connected) {
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
      
      <VideoControls
        isPlaying={isPlaying}
        isMuted={isMuted}
        progress={progress}
        isAdmin={isAdmin}
        metadata={metadata}
        onPlayPause={togglePlay}
        onMute={toggleMute}
        onFullscreen={handleFullscreen}
        onShowMetadata={() => setShowMetadata(true)}
      />

      {metadata && (
        <VideoMetadataDialog
          metadata={metadata}
          open={showMetadata}
          onOpenChange={setShowMetadata}
        />
      )}
    </div>
  );
};
