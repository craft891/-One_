// server.js
// This file sets up the Node.js server using Express and Socket.IO.
// It now handles usernames, avatars, and image messages.

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
// Increase the max payload size to allow for base64 images
const io = new Server(server, {
  maxHttpBufferSize: 1e7 // 10 MB
});

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

  // Listen for a user joining with their info
  socket.on('user joined', (userData) => {
    // Broadcast to other users that a new person has joined
    socket.broadcast.emit('system message', `${userData.username} has joined the chat!`);
  });

  // Listen for 'chat message' events from a client
  socket.on('chat message', (msg) => {
    // Broadcast the message to all other connected clients
    socket.broadcast.emit('chat message', msg);
  });

  // Listen for 'chat image' events from a client
  socket.on('chat image', (msg) => {
    // Broadcast the image message to all other connected clients
    socket.broadcast.emit('chat image', msg);
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

