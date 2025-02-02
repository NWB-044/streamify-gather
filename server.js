const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
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

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('videoSync', (data) => {
    console.log('Video sync event:', data);
    socket.broadcast.emit('videoSync', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});