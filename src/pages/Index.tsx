import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, Video } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-4xl w-full space-y-8 fade-in">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to StreamSync</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="w-6 h-6" />
                Join as Viewer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Watch synchronized streams with other viewers
              </p>
              <Link to="/stream">
                <Button className="w-full">Join Stream</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-6 h-6" />
                Start Streaming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create and manage your own stream
              </p>
              <Link to="/admin">
                <Button className="w-full">Start Streaming</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;