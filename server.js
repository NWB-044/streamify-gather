const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const os = require('os');
const app = express();
const server = require('http').createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.static('uploads'));

// Track connected viewers
let connectedViewers = new Set();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  connectedViewers.add(socket.id);

  // Send initial metrics
  sendMetrics();

  socket.on('videoSync', (data) => {
    console.log('Video sync event:', data);
    socket.broadcast.emit('videoSync', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedViewers.delete(socket.id);
  });
});

// Send system metrics every 5 seconds
function sendMetrics() {
  const metrics = {
    ramUsage: Math.round((1 - os.freemem() / os.totalmem()) * 100),
    freeMemory: os.freemem(),
    onlineViewers: connectedViewers.size,
    bandwidth: {
      // Simplified bandwidth calculation
      download: Math.random() * 100,
      upload: Math.random() * 100
    },
    latency: Math.round(Math.random() * 100) // Simplified latency simulation
  };

  io.emit('metrics', metrics);
}

setInterval(sendMetrics, 5000);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});