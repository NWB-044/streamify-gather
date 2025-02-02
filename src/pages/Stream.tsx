import { VideoPlayer } from '@/components/VideoPlayer';

const Stream = () => {
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