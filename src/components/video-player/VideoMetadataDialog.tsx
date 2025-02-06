
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoMetadata {
  title: string;
  duration: number;
  fileSize: number;
  format: string;
  resolution: string;
}

interface VideoMetadataDialogProps {
  metadata: VideoMetadata;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VideoMetadataDialog = ({ 
  metadata, 
  open, 
  onOpenChange 
}: VideoMetadataDialogProps) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Video Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Title</p>
            <p className="text-sm text-muted-foreground">{metadata.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Duration</p>
            <p className="text-sm text-muted-foreground">
              {formatDuration(metadata.duration)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">File Size</p>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(metadata.fileSize)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Format</p>
            <p className="text-sm text-muted-foreground">{metadata.format}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Resolution</p>
            <p className="text-sm text-muted-foreground">{metadata.resolution}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
