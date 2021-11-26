const { chainStatusRoom, overviewRoom } = require("./constants");
const { getScanHeight, getOverview } = require("./store");
const { feedScanStatus } = require("./status");
const { feedOverview } = require("./overview");

async function listenAndEmitInfo(io) {
  io.on("connection", (socket) => {
    socket.on("subscribe", (room) => {
      const roomId = room;
      socket.join(roomId);

      if (room?.data === chainStatusRoom) {
        const scanHeight = getScanHeight();
        io.to(roomId).emit("scanStatus", { height: scanHeight });
      } else if (room?.data === overviewRoom) {
        const overview = getOverview();
        io.to(roomId).emit("overview", overview);
      }
    });

    socket.on("unsubscribe", (room) => {
      const roomId = room;
      socket.leave(roomId);
    });
  });

  await feedScanStatus(io);
  await feedOverview(io);
}

module.exports = {
  listenAndEmitInfo,
};
