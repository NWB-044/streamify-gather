import { VideoPlayer } from '@/components/VideoPlayer';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const Stream = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Show welcome toast
    toast({
      title: "Welcome to Stream",
      description: "Connecting to stream...",
    });
  }, [toast]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-6xl w-full space-y-6 fade-in">
        <h1 className="text-xl font-semibold text-center">Live Stream</h1>
        <VideoPlayer src="/placeholder-video.mp4" />
      </div>
    </div>
  );
};

export default Stream;