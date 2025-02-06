
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  isMuted: boolean;
  onMute: () => void;
}

export const VolumeControl = ({ isMuted, onMute }: VolumeControlProps) => {
  return (
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
  );
};
