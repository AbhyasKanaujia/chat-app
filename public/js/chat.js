const socket = io();

// socket.on("countUpdated", (count) => {
//   console.log(`The count has been updated to ${count}`);
// });

// document.querySelector("#increment").addEventListener("click", () => {
//   socket.emit("increment");
// });

const message = [];
socket.on("message", (message) => {
  console.log(message);
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message);
});
