var rooms = {};
function joinRoom(room) {
  if (!(room in rooms)) {
    rooms[room] = [];
    return [true];
  } else if (room in rooms && rooms[room].length < 2) {
    return [false, rooms[room][0]];
  } else return "roomfull";
}
function AddSdp(sdp, room) {
  if (sdp.type === "offer") {
    rooms[room].push(sdp);
    return true;
  }
}
function DeleteRoom(room) {
  delete rooms[room];
}
exports.joinRoom = joinRoom;
exports.AddSdp = AddSdp;
exports.DeleteRoom = DeleteRoom;
