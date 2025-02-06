
import React from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Info } from 'lucide-react';

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
        {isAdmin && (
          <button
            onClick={onPlayPause}
            className="text-white hover:text-primary/80 transition-colors"
            disabled={!isAdmin}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
        )}
        
        <button
          onClick={onMute}
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
