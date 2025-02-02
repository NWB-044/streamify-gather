import { useEffect } from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { requireAdmin } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Admin = () => {
  const { toast } = useToast();

  useEffect(() => {
    requireAdmin();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, implement file upload logic
      toast({
        title: "File Selected",
        description: `Selected: ${file.name}`,
      });
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6 fade-in">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-xl font-semibold">Current Stream</h2>
          <VideoPlayer src="/placeholder-video.mp4" isAdmin={true} />
          
          <div className="flex gap-4">
            <Button
              onClick={() => {
                toast({
                  title: "Stream Started",
                  description: "Viewers can now join the stream",
                });
              }}
            >
              Start Stream
            </Button>
            <Button variant="secondary">
              End Stream
            </Button>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="text-xl font-semibold">Upload Video</h2>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-muted-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90"
          />
        </div>
      </div>
    </div>
  );
};

export default Admin;