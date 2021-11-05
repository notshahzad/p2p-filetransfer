var socket = io();
var peer;
var DATA = new Uint8Array(),
  filename,
  filesize;
const filereader = new FileReader();
function SendRoom() {
  room = document.getElementById("room").value;
  socket.emit("room", room);
}
SendRoom();
socket.on("initiator", (initiator) => {
  if (initiator !== "roomfull") {
    peer = new SimplePeer({
      initiator: initiator[0],
      trickle: false,
    });
    if (!initiator[0]) {
      offer = JSON.stringify(initiator[1]);
      peer.signal(offer);
    }
    if (initiator[0]) {
      socket.on("answer", (sdp) => {
        peer.signal(sdp);
        socket.close();
      });
    }
    peer.on("signal", (sdp) => {
      socket.emit("sdp", { sdp, room });
      if (!initiator[0]) socket.close();
    });
    peer.on("data", (d) => {
      try {
        data = JSON.parse(d.toString());
      } catch {
        data = d;
      }
      if (data.type === "header") {
        filename = data.name;
        filesize = data.size;
        console.log(filename, filesize);
      } else {
        console.log(data);
      }
    });
  } else alert("haha sucks to be you the room is already taken");
});
// file reader
var filecount = 0;
function fileRedur() {
  const f = document.getElementById("f").files;
  filereader.onload = (ev) => {
    upload(f[filecount], ev);
    filecount++;
    fileRedur();
  };
  if (filecount == f.length) {
    filecount = 0;
    return;
  }
  filereader.readAsArrayBuffer(f[filecount]);
}
function upload(metadata, data) {
  var bytes = new Uint8Array(data.target.result);
  var byteLength = data.target.result.byteLength;
  const CHUNK_SIZE = 1000;
  const CHUNK_ID = byteLength / CHUNK_SIZE;
  peer.send(
    JSON.stringify({ name: metadata.name, size: byteLength, type: "header" })
  );
  for (let i = 0; i < CHUNK_ID; i++) {
    var CHUNK = bytes.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE);
    peer.send(CHUNK);
  }
}
