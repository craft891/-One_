const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 1e8
});

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

let connectedUsers = 0;

io.on('connection', (socket) => {
  connectedUsers++;
  io.emit('user count', connectedUsers);
  console.log(`A user connected. Total users: ${connectedUsers}`);

  
  socket.on('encrypted message', (encryptedData) => {
    socket.broadcast.emit('encrypted message', encryptedData);
  });


  socket.on('disconnect', () => {
    connectedUsers--;
    io.emit('user count', connectedUsers);
    console.log(`A user disconnected. Total users: ${connectedUsers}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

