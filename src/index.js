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
    socket.emit("message", generateMessage("admin", "Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage("admin", `${user.username} has joined the room`)
      );

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    if (!user) {
      return callback("User not found");
    }

    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }

    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("admin", `${user.username} has left the room`)
      );

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  socket.on("sendLocation", (location, callback) => {
    const user = getUser(socket.id);

    if (!user) {
      return callback("User not found");
    }

    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        user.username,
        `https://google.com/maps?q=${location.latitude},${location.longitude}`
      )
    );
    callback();
  });
});

server.listen(process.env.PORT || 5001, () =>
  console.log(`Server running on port ${process.env.PORT || 5001}`)
);
