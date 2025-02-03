import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { watch } from 'fs';
import { readdir, stat } from 'fs/promises';
import { join, resolve } from 'path';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const VIDEOS_DIR = './videos'; // Create this directory in your project root
const SUPPORTED_FORMATS = ['.mp4', '.webm', '.ogg', '.mkv', '.avi', '.mov'];

// Ensure videos directory exists
import { mkdir } from 'fs/promises';
try {
  await mkdir(VIDEOS_DIR, { recursive: true });
} catch (err) {
  console.error('Error creating videos directory:', err);
}

// Watch for file changes
watch(VIDEOS_DIR, { recursive: true }, async (eventType, filename) => {
  if (filename) {
    const filePath = join(VIDEOS_DIR, filename);
    try {
      const stats = await stat(filePath);
      if (stats.isFile()) {
        io.emit('fileAdded', {
          name: filename,
          path: filePath,
          size: stats.size,
          lastModified: stats.mtimeMs
        });
      }
    } catch (err) {
      // File was probably deleted
      io.emit('fileRemoved', filePath);
    }
  }
});

// Get initial file list
async function getVideoFiles() {
  try {
    const files = await readdir(VIDEOS_DIR);
    const videoFiles = await Promise.all(
      files
        .filter(file => SUPPORTED_FORMATS.some(format => file.toLowerCase().endsWith(format)))
        .map(async file => {
          const filePath = join(VIDEOS_DIR, file);
          const stats = await stat(filePath);
          return {
            name: file,
            path: filePath,
            size: stats.size,
            lastModified: stats.mtimeMs
          };
        })
    );
    return videoFiles;
  } catch (err) {
    console.error('Error reading video files:', err);
    return [];
  }
}

// Socket.IO connection handling
io.on('connection', async (socket) => {
  console.log('Client connected');

  socket.on('requestFileList', async () => {
    const files = await getVideoFiles();
    socket.emit('fileList', files);
  });

  // Handle video synchronization
  let currentVideo = null;
  let isPlaying = false;
  let currentTime = 0;

  socket.on('videoSync', (data) => {
    currentVideo = data.video || currentVideo;
    isPlaying = data.isPlaying;
    currentTime = data.currentTime;
    socket.broadcast.emit('videoSync', { isPlaying, currentTime, video: currentVideo });
  });

  // Send system metrics every 5 seconds
  const metricsInterval = setInterval(() => {
    const metrics = {
      ramUsage: Math.floor(Math.random() * 20) + 70, // Simulated RAM usage 70-90%
      freeMemory: Math.floor(Math.random() * 1000000000), // Simulated free memory
      onlineViewers: io.engine.clientsCount,
      bandwidth: {
        download: Math.random() * 100,
        upload: Math.random() * 100
      },
      latency: Math.floor(Math.random() * 100) // Simulated latency 0-100ms
    };
    socket.emit('metrics', metrics);
  }, 5000);

  socket.on('disconnect', () => {
    clearInterval(metricsInterval);
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});