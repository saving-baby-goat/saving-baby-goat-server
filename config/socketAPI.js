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

    socket.on("sendNodeList", ({ nodeList, targetId }) => {
      io.to(targetId).emit("receiveNodeList", nodeList);
    });

    socket.on("sendMineralNodeIdList", ({ mineralNodeIdList, targetId }) => {
      io.to(targetId).emit("receiveMineralNodeIdList", mineralNodeIdList);
    });

    socket.on("sendEndOfTurn", ({ currentGameState, targetId }) => {
      io.to(targetId).emit("receiveEndOfTurn", currentGameState);
    });

    socket.on("sendMineralCount", ({ currentGameState, targetId }) => {
      io.to(targetId).emit("receiveMineralCount", currentGameState);
    });

    socket.on("sendGameOver", ({ currentGameState, targetId }) => {
      io.to(targetId).emit("receiveGameOver", currentGameState);
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
      gameRoomInfo.currentGameRoomId = `room-${socket.id}`;
      gameRoomInfo.player1Nickname = nickname;
      gameRoomInfo.player1SocketId = socket.id;
      io.gameRooms.EASY.openRoom.push(gameRoomInfo);
    } else {
      gameRoomInfo = io.gameRooms.EASY.openRoom.pop();
      gameRoomInfo.player2Nickname = nickname;
      gameRoomInfo.player2SocketId = socket.id;
      io.gameRooms.EASY.closeRooms.push(gameRoomInfo);
    }
  }

  if (level === LEVEL.NORMAL) {
    if (!io.gameRooms.NORMAL.openRoom.length) {
      gameRoomInfo.currentGameRoomId = `room-${socket.id}`;
      gameRoomInfo.player1Nickname = nickname;
      gameRoomInfo.player1SocketId = socket.id;
      io.gameRooms.NORMAL.openRoom.push(gameRoomInfo);
    } else {
      gameRoomInfo = io.gameRooms.NORMAL.openRoom.pop();
      gameRoomInfo.player2Nickname = nickname;
      gameRoomInfo.player2SocketId = socket.id;
      io.gameRooms.NORMAL.closeRooms.push(gameRoomInfo);
    }
  }

  if (level === LEVEL.HARD) {
    if (!io.gameRooms.HARD.openRoom.length) {
      gameRoomInfo.currentGameRoomId = `room-${socket.id}`;
      gameRoomInfo.player1Nickname = nickname;
      gameRoomInfo.player1SocketId = socket.id;
      io.gameRooms.HARD.openRoom.push(gameRoomInfo);
    } else {
      gameRoomInfo = io.gameRooms.HARD.openRoom.pop();
      gameRoomInfo.player2Nickname = nickname;
      gameRoomInfo.player2SocketId = socket.id;
      io.gameRooms.HARD.closeRooms.push(gameRoomInfo);
    }
  }

  socket.gameRoomInfo = gameRoomInfo;
  socket.join(socket.gameRoomInfo.currentGameRoomId);

  io.to(gameRoomInfo.currentGameRoomId).emit(
    "joinGameRoom",
    socket.gameRoomInfo
  );
}
