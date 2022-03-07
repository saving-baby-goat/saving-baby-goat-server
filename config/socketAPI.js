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

    socket.on("sendStartNodeId", ({ nodeId, targetId }) => {
      io.to(targetId).emit("receiveStartNodeId", nodeId);
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
      disconnectHelper(io, socket);
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

function disconnectHelper(io, socket) {
  const targetGameRoomId = `room-${socket.id}`;

  for (let i = 0; i < io.gameRooms.EASY.openRoom.length; i++) {
    if (io.gameRooms.EASY.openRoom[i].currentGameRoomId === targetGameRoomId) {
      io.gameRooms.EASY.openRoom.splice(i, 1);
    }
  }

  for (let i = 0; i < io.gameRooms.NORMAL.openRoom.length; i++) {
    if (
      io.gameRooms.NORMAL.openRoom[i].currentGameRoomId === targetGameRoomId
    ) {
      io.gameRooms.NORMAL.openRoom.splice(i, 1);
    }
  }

  for (let i = 0; i < io.gameRooms.HARD.openRoom.length; i++) {
    if (io.gameRooms.HARD.openRoom[i].currentGameRoomId === targetGameRoomId) {
      io.gameRooms.HARD.openRoom.splice(i, 1);
    }
  }

  let easyIndex = -1;
  let normalIndex = -1;
  let hardIndex = -1;
  let targetId = "";

  for (let i = 0; i < io.gameRooms.EASY.closeRooms.length; i++) {
    easyIndex = io.gameRooms.EASY.closeRooms.findIndex(
      (playersSocketId) => playersSocketId.player1SocketId === socket.id
    );
    if (easyIndex > -1) {
      targetId = io.gameRooms.EASY.closeRooms[easyIndex].player2SocketId;
      break;
    }

    easyIndex = io.gameRooms.EASY.closeRooms.findIndex(
      (playersSocketId) => playersSocketId.player2SocketId === socket.id
    );
    if (easyIndex > -1) {
      targetId = io.gameRooms.EASY.closeRooms[easyIndex].player1SocketId;
      break;
    }
  }

  for (let i = 0; i < io.gameRooms.NORMAL.closeRooms.length; i++) {
    normalIndex = io.gameRooms.NORMAL.closeRooms.findIndex(
      (playersSocketId) => playersSocketId.player1SocketId === socket.id
    );
    if (normalIndex > -1) {
      targetId = io.gameRooms.NORMAL.closeRooms[normalIndex].player2SocketId;
      break;
    }

    normalIndex = io.gameRooms.NORMAL.closeRooms.findIndex(
      (playersSocketId) => playersSocketId.player2SocketId === socket.id
    );
    if (normalIndex > -1) {
      targetId = io.gameRooms.NORMAL.closeRooms[normalIndex].player1SocketId;
      break;
    }
  }

  for (let i = 0; i < io.gameRooms.HARD.closeRooms.length; i++) {
    hardIndex = io.gameRooms.HARD.closeRooms.findIndex(
      (playersSocketId) => playersSocketId.player1SocketId === socket.id
    );
    if (hardIndex > -1) {
      targetId = io.gameRooms.HARD.closeRooms[hardIndex].player2SocketId;
      break;
    }

    hardIndex = io.gameRooms.HARD.closeRooms.findIndex(
      (playersSocketId) => playersSocketId.player2SocketId === socket.id
    );
    if (hardIndex > -1) {
      targetId = io.gameRooms.HARD.closeRooms[hardIndex].player1SocketId;
      break;
    }
  }

  if (easyIndex > -1) {
    io.gameRooms.EASY.closeRooms.splice(easyIndex, 1);
  }
  if (normalIndex > -1) {
    io.gameRooms.NORMAL.closeRooms.splice(easyIndex, 1);
  }
  if (hardIndex > -1) {
    io.gameRooms.HARD.closeRooms.splice(easyIndex, 1);
  }

  io.to(targetId).emit("leaveGame");
  socket.disconnect();
  // eslint-disable-next-line no-console
  console.log("User Disconnected", socket.id);
}
