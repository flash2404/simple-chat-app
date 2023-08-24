const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

let onlineUsers = 0; // Keep track of online user count

io.on('connection', (socket) => {
  console.log('A user connected');
  onlineUsers++; // Increment online user count
  io.emit('user count', onlineUsers); // Send updated count to clients

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    onlineUsers--; // Decrement online user count
    io.emit('user count', onlineUsers); // Send updated count to clients
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', { sender: socket.nickname, message: msg });
  });

  socket.on('set nickname', (nickname) => {
    socket.nickname = nickname; // Set the nickname for the socket
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




