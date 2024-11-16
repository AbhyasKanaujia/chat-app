const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "../public")));

let count = 0;

io.on("connection", (socket) => {
  console.log("New websocket connection");

  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }

    console.log(user);

    socket.join(user.room);
    socket.emit("message", generateMessage("Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(`${user.username} has joined the room`));

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }

    io.emit("message", generateMessage(message));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user)
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left the room`)
      );
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
