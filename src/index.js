const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

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

  socket.emit("message", generateMessage("Welcome!"));
  socket.broadcast.emit("message", generateMessage("A new user has joined"));

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }

    io.emit("message", generateMessage(message));
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left"));
  });

  socket.on("sendLocation", (location, callback) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${location.latitude},${location.longitude}`
      )
    );
    callback();
  });
});

server.listen(process.env.PORT || 5001, () =>
  console.log(`Server running on port ${process.env.PORT || 5001}`)
);
