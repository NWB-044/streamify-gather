
import React from 'react';
import { Play, Pause } from 'lucide-react';

interface PlayPauseControlProps {
  isPlaying: boolean;
  isAdmin: boolean;
  onPlayPause: () => void;
}

export const PlayPauseControl = ({ isPlaying, isAdmin, onPlayPause }: PlayPauseControlProps) => {
  if (!isAdmin) return null;
  
  return (
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
  );
};
