const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(` chat server is runnig on ${port} port `);
});
const connectionCount = new Set();
app.use(express.static(path.join(__dirname, "public")));
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  connectionCount.add(socket.id);

  io.emit("countconnection", connectionCount.size);

  socket.on("disconnect", () => {
    connectionCount.delete(socket.id);
    io.emit("countconnection", connectionCount.size);
  });
  socket.on("message", (data) => {
    socket.broadcast.emit("brodcastmessage", data);
  });
  socket.on("feedback", (data) => {
    socket.broadcast.emit("brodcastfeedback", data);
  });
});
