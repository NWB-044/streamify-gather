import React, { useEffect, useState } from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { StreamAuth } from '@/components/StreamAuth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { io } from 'socket.io-client';
import { format } from 'date-fns';

interface Activity {
  type: string;
  timestamp: Date;
  details: string;
}

const Stream = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const { toast } = useToast();
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('userActivity', (activity: Activity) => {
      setActivities(prev => [...prev, {
        ...activity,
        timestamp: new Date(activity.timestamp)
      }]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleAuth = (username: string) => {
    socket?.emit('userAuth', { username, passcode: '1732010' });
    socket?.on('authSuccess', () => {
      setIsAuthenticated(true);
      setUsername(username);
      toast({
        title: "Welcome!",
        description: `Logged in as ${username}`,
      });
    });
  };

  const handleLogout = () => {
    socket?.emit('logout');
    setIsAuthenticated(false);
    setUsername('');
    toast({
      title: "Goodbye!",
      description: "Successfully logged out",
    });
  };

  if (!isAuthenticated) {
    return <StreamAuth onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen p-6 space-y-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Stream View</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VideoPlayer src="/placeholder-video.mp4" />
          </div>
          
          <div className="glass-card p-4">
            <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {activities.map((activity, index) => (
                  <div key={index} className="text-sm p-2 rounded bg-secondary/50">
                    <p className="font-medium">{activity.details}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.timestamp), 'HH:mm:ss')}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stream;