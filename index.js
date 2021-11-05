const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const { joinRoom, AddSdp, DeleteRoom } = require("./rooms/rooms");
const app = express();
app.use(express.static(`${__dirname}/views`));
app.use(bodyParser.urlencoded({ extended: true }));
const httpServer = http.createServer(app);
const io = socketio(httpServer);
app.get("/", (req, res) => {
  res.render("./index.html");
});
io.on("connect", (socket) => {
  socket.on("room", (room) => {
    initiator = joinRoom(room);
    socket.emit("initiator", initiator);
    if (initiator !== "roomfull") {
      socket.join(room);
    }
  });
  socket.on("sdp", ({ sdp, room }) => {
    if (sdp.type === "offer") AddSdp(sdp, room);
    else if (sdp.type === "answer") {
      DeleteRoom(room);
      socket.broadcast.to(room).emit("answer", sdp);
    }
  });
});
httpServer.listen(3000, () => console.log("listening on port 3000..."));
