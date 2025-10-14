// server.js
// This file sets up the Node.js server using Express and Socket.IO.

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve the static HTML file from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

let connectedUsers = 0;

// Listen for new connections
io.on('connection', (socket) => {
  // A user has connected
  connectedUsers++;
  io.emit('user count', connectedUsers);
  console.log(`A user connected. Total users: ${connectedUsers}`);

  // Listen for 'chat message' events from a client
  socket.on('chat message', (msg) => {
    // Broadcast the message to all other connected clients
    socket.broadcast.emit('chat message', msg);
  });

  // Listen for a user disconnecting
  socket.on('disconnect', () => {
    connectedUsers--;
    io.emit('user count', connectedUsers);
    console.log(`A user disconnected. Total users: ${connectedUsers}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
