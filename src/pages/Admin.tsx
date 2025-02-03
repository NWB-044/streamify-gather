import React, { useEffect, useState } from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { requireAdmin } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { monitoringService } from '@/services/MonitoringService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Admin = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState({
    ramUsage: 0,
    freeMemory: 0,
    onlineViewers: 0,
    bandwidth: {
      download: 0,
      upload: 0
    },
    latency: 0
  });

  useEffect(() => {
    requireAdmin();
    
    // Poll metrics every 5 seconds
    const interval = setInterval(() => {
      const currentMetrics = monitoringService.getMetrics();
      setMetrics(currentMetrics);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const supportedFormats = [
        'video/mp4', 'video/webm', 'video/ogg',
        'video/x-matroska', 'video/avi', 'video/quicktime'
      ];

      if (!supportedFormats.includes(file.type)) {
        toast({
          title: "Unsupported Format",
          description: "Please upload a supported video format",
          variant: "destructive"
        });
        return;
      }

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
        
        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>RAM Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{metrics.ramUsage}%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Free Memory</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{(metrics.freeMemory / 1024).toFixed(2)} GB</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Online Viewers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{metrics.onlineViewers}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{metrics.latency}ms</p>
            </CardContent>
          </Card>
        </div>

        {/* Stream Control */}
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

        {/* Upload Section */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-xl font-semibold">Upload Video</h2>
          <input
            type="file"
            accept="video/*,.mkv,.avi,.mov,.mp4,.webm,.ogg"
            onChange={handleFileSelect}
            className="block w-full text-sm text-muted-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90"
          />
          <p className="text-sm text-muted-foreground">
            Supported formats: MP4, WebM, OGG, MKV, AVI, MOV
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;