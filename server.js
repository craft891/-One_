const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
// Increase the max payload size to allow for encrypted images
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

  // When an encrypted message is received, broadcast it to everyone else.
  // The server doesn't know what's inside, it just passes it along.
  socket.on('encrypted message', (encryptedData) => {
    socket.broadcast.emit('encrypted message', encryptedData);
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

