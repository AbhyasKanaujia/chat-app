const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "../public")));

let count = 0;

io.on("connection", (socket) => {
  console.log("New websocket connection");

  // socket.emit("countUpdated", count);
  // socket.on("increment", () => {
  //   count++;
  //   io.emit("countUpdated", count);
  // });

  socket.emit("message", "Welcome!");

  socket.on("sendMessage", (message) => {
    console.log(message);
    io.emit("message", message);
  });
});

server.listen(process.env.PORT || 5001, () =>
  console.log(`Server running on port ${process.env.PORT || 5001}`)
);
