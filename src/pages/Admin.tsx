import React, { useEffect, useState } from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { FileManager } from '@/components/FileManager';
import { requireAdmin } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const [selectedVideo, setSelectedVideo] = useState('');

  useEffect(() => {
    requireAdmin();
  }, []);

  const handleVideoSelect = (path) => {
    console.log('Selected video:', path);
    setSelectedVideo(path);
    toast({
      title: "Video Selected",
      description: "Starting playback...",
    });
  };

  const formatMemory = (bytes) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  return (
    <div className="min-h-screen p-6 space-y-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-6 fade-in">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
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
              <p className="text-2xl font-bold">{formatMemory(metrics.freeMemory)}</p>
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Stream</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedVideo ? (
                <VideoPlayer src={selectedVideo} isAdmin={true} />
              ) : (
                <div className="aspect-video bg-secondary/50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Select a video to start streaming</p>
                </div>
              )}
            </CardContent>
          </Card>

          <FileManager onVideoSelect={handleVideoSelect} />
        </div>
      </div>
    </div>
  );
};

export default Admin;