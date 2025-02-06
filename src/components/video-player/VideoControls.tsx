
import React from 'react';
import { Maximize, Info } from 'lucide-react';
import { PlayPauseControl } from './PlayPauseControl';
import { VolumeControl } from './VolumeControl';
import { VideoProgressBar } from './VideoProgressBar';

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  isAdmin: boolean;
  metadata?: any;
  onPlayPause: () => void;
  onMute: () => void;
  onFullscreen: () => void;
  onShowMetadata: () => void;
}

export const VideoControls = ({
  isPlaying,
  isMuted,
  progress,
  isAdmin,
  metadata,
  onPlayPause,
  onMute,
  onFullscreen,
  onShowMetadata,
}: VideoControlsProps) => {
  return (
    <div className="video-controls absolute bottom-0 left-0 right-0 bg-black/60 p-4">
      <div className="flex items-center gap-4">
        <PlayPauseControl 
          isPlaying={isPlaying} 
          isAdmin={isAdmin} 
          onPlayPause={onPlayPause} 
        />
        
        <VolumeControl 
          isMuted={isMuted} 
          onMute={onMute} 
        />

        <VideoProgressBar progress={progress} />

        {metadata && (
          <button
            onClick={onShowMetadata}
            className="text-white hover:text-primary/80 transition-colors"
          >
            <Info className="w-6 h-6" />
          </button>
        )}

        <button
          onClick={onFullscreen}
          className="text-white hover:text-primary/80 transition-colors"
        >
          <Maximize className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
