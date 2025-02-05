
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { watch } from 'fs';
import { readdir, stat } from 'fs/promises';
import { join, resolve, extname } from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const VIDEOS_DIR = './videos';
const SUBTITLES_DIR = './subtitles';
const SUPPORTED_VIDEO_FORMATS = ['.mp4', '.webm', '.ogg', '.mkv', '.avi', '.mov'];
const SUPPORTED_SUBTITLE_FORMATS = ['.srt', '.vtt', '.ass'];

// Ensure directories exist
import { mkdir } from 'fs/promises';
try {
  await mkdir(VIDEOS_DIR, { recursive: true });
  await mkdir(SUBTITLES_DIR, { recursive: true });
  console.log('Created necessary directories');
} catch (err) {
  console.error('Error creating directories:', err);
}

const getVideoMetadata = async (filePath) => {
  try {
    const stats = await stat(filePath);
    const extension = extname(filePath).toLowerCase();
    
    // Basic metadata from file stats
    const metadata = {
      title: filePath.split('/').pop(),
      fileSize: stats.size,
      format: extension.slice(1),
      duration: 0,
      resolution: ''
    };

    // You could add ffprobe here for more detailed metadata
    // This is just a basic implementation
    
    return metadata;
  } catch (error) {
    console.error('Error getting video metadata:', error);
    return null;
  }
};

const watchDirectory = (dir, type) => {
  watch(dir, { recursive: true }, async (eventType, filename) => {
    if (filename) {
      const filePath = join(dir, filename);
      try {
        const stats = await stat(filePath);
        if (stats.isFile()) {
          const metadata = type === 'video' ? await getVideoMetadata(filePath) : null;
          io.emit('fileChanged', {
            type,
            event: 'added',
            file: {
              name: filename,
              path: filePath,
              size: stats.size,
              lastModified: stats.mtimeMs,
              metadata
            }
          });
        }
      } catch (err) {
        io.emit('fileChanged', {
          type,
          event: 'removed',
          path: filePath
        });
      }
    }
  });
};

watchDirectory(VIDEOS_DIR, 'video');
watchDirectory(SUBTITLES_DIR, 'subtitle');

async function getFiles(dir, formats) {
  try {
    const files = await readdir(dir);
    const validFiles = await Promise.all(
      files
        .filter(file => formats.some(format => file.toLowerCase().endsWith(format)))
        .map(async file => {
          const filePath = join(dir, file);
          const stats = await stat(filePath);
          const metadata = dir === VIDEOS_DIR ? await getVideoMetadata(filePath) : null;
          return {
            name: file,
            path: filePath,
            size: stats.size,
            lastModified: stats.mtimeMs,
            metadata
          };
        })
    );
    return validFiles;
  } catch (err) {
    console.error(`Error reading files from ${dir}:`, err);
    return [];
  }
}

// Track connected users and their activities
const connectedUsers = new Map();

io.on('connection', async (socket) => {
  console.log('Client connected');
  
  socket.on('userAuth', ({ username, passcode }) => {
    if (passcode === '1732010') {
      connectedUsers.set(socket.id, {
        username,
        joinedAt: new Date(),
        activities: []
      });
      
      const activity = {
        type: 'login',
        timestamp: new Date(),
        details: `${username} logged in`
      };
      
      if (connectedUsers.has(socket.id)) {
        connectedUsers.get(socket.id).activities.push(activity);
      }
      
      io.emit('userActivity', activity);
      socket.emit('authSuccess', { username });
    } else {
      socket.emit('authError', { message: 'Invalid passcode' });
    }
  });

  socket.on('requestFiles', async () => {
    const videos = await getFiles(VIDEOS_DIR, SUPPORTED_VIDEO_FORMATS);
    const subtitles = await getFiles(SUBTITLES_DIR, SUPPORTED_SUBTITLE_FORMATS);
    socket.emit('fileList', { videos, subtitles });
  });

  socket.on('videoSync', (state) => {
    socket.broadcast.emit('videoSync', state);
  });

  socket.on('logout', () => {
    if (connectedUsers.has(socket.id)) {
      const user = connectedUsers.get(socket.id);
      const activity = {
        type: 'logout',
        timestamp: new Date(),
        details: `${user.username} logged out`
      };
      io.emit('userActivity', activity);
      connectedUsers.delete(socket.id);
    }
  });

  socket.on('disconnect', () => {
    if (connectedUsers.has(socket.id)) {
      const user = connectedUsers.get(socket.id);
      const activity = {
        type: 'disconnect',
        timestamp: new Date(),
        details: `${user.username} disconnected`
      };
      io.emit('userActivity', activity);
      connectedUsers.delete(socket.id);
    }
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
