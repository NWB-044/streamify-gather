
import React from 'react';

interface VideoProgressBarProps {
  progress: number;
}

export const VideoProgressBar = ({ progress }: VideoProgressBarProps) => {
  return (
    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
