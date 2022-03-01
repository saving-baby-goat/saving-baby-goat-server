const { Server } = require("socket.io");

const { LEVEL } = require("../utills/constants");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN_URL,
      credentials: true,
    },
  });

  io.gameRooms = {
    EASY: {
      openRoom: [],
      closeRooms: [],
    },
    NORMAL: {
      openRoom: [],
      closeRooms: [],
    },
    HARD: {
      openRoom: [],
      closeRooms: [],
    },
  };

  io.on("connection", (socket) => {
    socket.on("joinGameRoom", (playerInfo) => {
      joinGameRoomHelper(io, socket, playerInfo);
    });

    socket.on("sendMap", (nodeList) => {
      io.to(socket.gameRoomInfo.currentGameRoomId).emit("sendMap", nodeList);
    });

    // socket.to(socket.id).emit("broadcast",)

    // socket.emit();
    // socket.on("openDocument", (게임방이름) => {
    //   socket.join(게임방이름);
    //   // eslint-disable-next-line no-console
    //   console.log(`User ID: ${socket.id} Document ID: ${data}`);
    //   socket.to(게임방이름).emit("receiveContents", data);
    // });

    socket.on("openDocument", (data) => {
      socket.join(data);
      // eslint-disable-next-line no-console
      console.log(`User ID: ${socket.id} Document ID: ${data}`);
      socket.to(data.id).emit("receiveContents", data);
    });

    socket.on("sendContents", (data) => {
      socket.to(data.id).emit("receiveContents", data);
    });

    socket.on("disconnect", () => {
      // eslint-disable-next-line no-console
      console.log("User Disconnected", socket.id);
    });
  });
};

function joinGameRoomHelper(io, socket, playerInfo) {
  const { level, nickname } = playerInfo;

  let gameRoomInfo = {};

  if (level === LEVEL.EASY) {
    if (!io.gameRooms.EASY.openRoom.length) {
      gameRoomInfo.currentGameRoomId = socket.id;
      gameRoomInfo.player1Nickname = nickname;
      gameRoomInfo.player1SocketId = socket.id;
      io.gameRooms.EASY.openRoom.push(gameRoomInfo);
    } else {
      gameRoomInfo = io.gameRooms.EASY.openRoom.pop();
      io.gameRooms.EASY.closeRooms.push(gameRoomInfo);
      gameRoomInfo.player2Nickname = nickname;
      gameRoomInfo.player2SocketId = socket.id;
    }
  }

  if (level === LEVEL.NORMAL) {
    if (!io.gameRooms.NORMAL.openRoom.length) {
      gameRoomInfo.currentGameRoomId = socket.id;
      gameRoomInfo.player1Nickname = nickname;
      gameRoomInfo.player1SocketId = socket.id;
      io.gameRooms.NORMAL.openRoom.push(gameRoomInfo);
    } else {
      gameRoomInfo = io.gameRooms.NORMAL.openRoom.pop();
      io.gameRooms.NORMAL.closeRooms.push(gameRoomInfo);
      gameRoomInfo.player2Nickname = nickname;
      gameRoomInfo.player2SocketId = socket.id;
    }
  }

  if (level === LEVEL.HARD) {
    if (!io.gameRooms.HARD.openRoom.length) {
      gameRoomInfo.currentGameRoomId = socket.id;
      gameRoomInfo.player1Nickname = nickname;
      gameRoomInfo.player1SocketId = socket.id;
      io.gameRooms.HARD.openRoom.push(gameRoomInfo);
    } else {
      gameRoomInfo = io.gameRooms.HARD.openRoom.pop();
      io.gameRooms.HARD.closeRooms.push(gameRoomInfo);
      gameRoomInfo.player2Nickname = nickname;
      gameRoomInfo.player2SocketId = socket.id;
    }
  }
  socket.gameRoomInfo = gameRoomInfo;
  socket.join(gameRoomInfo.currentGameRoomId);
  io.to(gameRoomInfo.currentGameRoomId).emit("joinGameRoom", gameRoomInfo);
}
