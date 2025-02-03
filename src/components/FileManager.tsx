import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { FileVideo, Trash2 } from 'lucide-react';
import { io } from 'socket.io-client';

interface VideoFile {
  name: string;
  path: string;
  size: number;
  lastModified: number;
}

export const FileManager = ({ onVideoSelect }: { onVideoSelect: (path: string) => void }) => {
  const [files, setFiles] = useState<VideoFile[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const socket = io('http://localhost:3001');
    
    socket.on('connect', () => {
      console.log('Connected to file manager socket');
      socket.emit('requestFileList');
    });

    socket.on('fileList', (newFiles: VideoFile[]) => {
      console.log('Received file list:', newFiles);
      setFiles(newFiles);
    });

    socket.on('fileAdded', (file: VideoFile) => {
      console.log('New file added:', file);
      setFiles(prev => [...prev, file]);
      toast({
        title: "New File Detected",
        description: `${file.name} has been added to the library`,
      });
    });

    socket.on('fileRemoved', (filePath: string) => {
      console.log('File removed:', filePath);
      setFiles(prev => prev.filter(f => f.path !== filePath));
      toast({
        title: "File Removed",
        description: `A file has been removed from the library`,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [toast]);

  const formatSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Video Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {files.map((file) => (
            <div
              key={file.path}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileVideo className="w-5 h-5" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onVideoSelect(file.path)}
                >
                  Play
                </Button>
              </div>
            </div>
          ))}
          
          {files.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No videos found in the library folder
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};