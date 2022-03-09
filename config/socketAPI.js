const { Server } = require("socket.io");

const { increaseCustomMapPlayCount } = require("../service/custonMap");
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
      openRoomList: [],
      closeRoomList: [],
    },
    NORMAL: {
      openRoomList: [],
      closeRoomList: [],
    },
    HARD: {
      openRoomList: [],
      closeRoomList: [],
    },
    CUSTOM_MAP: {
      openRoomList: [],
      closeRoomList: [],
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
  const { level, nickname, customMapId } = playerInfo;

  let currentGameRoomInfo = {};

  if (level === LEVEL.CUSTOM_MAP) {
    const hasGameId = io.gameRooms.CUSTOM_MAP.openRoomList.filter(
      (room) => room.currentGameRoomId === customMapId
    );
    if (hasGameId.length) {
      currentGameRoomInfo = io.gameRooms.CUSTOM_MAP.openRoomList.pop();
      currentGameRoomInfo.player2Nickname = nickname;
      currentGameRoomInfo.player2SocketId = socket.id;
      io.gameRooms.CUSTOM_MAP.closeRoomList.push(currentGameRoomInfo);
      increaseCustomMapPlayCount(customMapId);
    } else {
      currentGameRoomInfo.currentGameRoomId = customMapId;
      currentGameRoomInfo.player1Nickname = nickname;
      currentGameRoomInfo.player1SocketId = socket.id;
      currentGameRoomInfo.level = LEVEL.CUSTOM_MAP;
      io.gameRooms.CUSTOM_MAP.openRoomList.push(currentGameRoomInfo);
    }
  }

  if (level === LEVEL.EASY) {
    if (!io.gameRooms.EASY.openRoomList.length) {
      currentGameRoomInfo.currentGameRoomId = `room-${socket.id}`;
      currentGameRoomInfo.player1Nickname = nickname;
      currentGameRoomInfo.player1SocketId = socket.id;
      io.gameRooms.EASY.openRoomList.push(currentGameRoomInfo);
    } else {
      currentGameRoomInfo = io.gameRooms.EASY.openRoomList.pop();
      currentGameRoomInfo.player2Nickname = nickname;
      currentGameRoomInfo.player2SocketId = socket.id;
      currentGameRoomInfo.level = LEVEL.EASY;
      io.gameRooms.EASY.closeRoomList.push(currentGameRoomInfo);
    }
  }

  if (level === LEVEL.NORMAL) {
    if (!io.gameRooms.NORMAL.openRoomList.length) {
      currentGameRoomInfo.currentGameRoomId = `room-${socket.id}`;
      currentGameRoomInfo.player1Nickname = nickname;
      currentGameRoomInfo.player1SocketId = socket.id;
      io.gameRooms.NORMAL.openRoomList.push(currentGameRoomInfo);
    } else {
      currentGameRoomInfo = io.gameRooms.NORMAL.openRoomList.pop();
      currentGameRoomInfo.player2Nickname = nickname;
      currentGameRoomInfo.player2SocketId = socket.id;
      currentGameRoomInfo.level = LEVEL.NORMAL;
      io.gameRooms.NORMAL.closeRoomList.push(currentGameRoomInfo);
    }
  }

  if (level === LEVEL.HARD) {
    if (!io.gameRooms.HARD.openRoomList.length) {
      currentGameRoomInfo.currentGameRoomId = `room-${socket.id}`;
      currentGameRoomInfo.player1Nickname = nickname;
      currentGameRoomInfo.player1SocketId = socket.id;
      io.gameRooms.HARD.openRoomList.push(currentGameRoomInfo);
    } else {
      currentGameRoomInfo = io.gameRooms.HARD.openRoomList.pop();
      currentGameRoomInfo.player2Nickname = nickname;
      currentGameRoomInfo.player2SocketId = socket.id;
      currentGameRoomInfo.level = LEVEL.HARD;
      io.gameRooms.HARD.closeRoomList.push(currentGameRoomInfo);
    }
  }

  socket.gameRoomInfo = currentGameRoomInfo;
  socket.join(socket.gameRoomInfo.currentGameRoomId);

  io.to(currentGameRoomInfo.currentGameRoomId).emit(
    "joinGameRoom",
    socket.gameRoomInfo
  );
}

function disconnectHelper(io, socket) {
  const targetGameRoomId = `room-${socket.id}`;

  for (let i = 0; i < io.gameRooms.EASY.openRoomList.length; i++) {
    if (
      io.gameRooms.EASY.openRoomList[i].currentGameRoomId === targetGameRoomId
    ) {
      io.gameRooms.EASY.openRoomList.splice(i, 1);
    }
  }

  for (let i = 0; i < io.gameRooms.NORMAL.openRoomList.length; i++) {
    if (
      io.gameRooms.NORMAL.openRoomList[i].currentGameRoomId === targetGameRoomId
    ) {
      io.gameRooms.NORMAL.openRoomList.splice(i, 1);
    }
  }

  for (let i = 0; i < io.gameRooms.HARD.openRoomList.length; i++) {
    if (
      io.gameRooms.HARD.openRoomList[i].currentGameRoomId === targetGameRoomId
    ) {
      io.gameRooms.HARD.openRoomList.splice(i, 1);
    }
  }

  for (let i = 0; i < io.gameRooms.CUSTOM_MAP.openRoomList.length; i++) {
    if (
      io.gameRooms.CUSTOM_MAP.openRoomList[i].player1SocketId === socket.id ||
      io.gameRooms.CUSTOM_MAP.openRoomList[i].player2SocketId === socket.id
    ) {
      io.gameRooms.CUSTOM_MAP.openRoomList.splice(i, 1);
    }
  }

  let easyIndex = -1;
  let normalIndex = -1;
  let hardIndex = -1;
  let customMapIndex = -1;
  let targetId = "";

  for (let i = 0; i < io.gameRooms.EASY.closeRoomList.length; i++) {
    easyIndex = io.gameRooms.EASY.closeRoomList.findIndex(
      (playersSocketId) => playersSocketId.player1SocketId === socket.id
    );

    if (easyIndex > -1) {
      targetId = io.gameRooms.EASY.closeRoomList[easyIndex].player2SocketId;
      break;
    }

    easyIndex = io.gameRooms.EASY.closeRoomList.findIndex(
      (playersSocketId) => playersSocketId.player2SocketId === socket.id
    );

    if (easyIndex > -1) {
      targetId = io.gameRooms.EASY.closeRoomList[easyIndex].player1SocketId;
      break;
    }
  }

  for (let i = 0; i < io.gameRooms.NORMAL.closeRoomList.length; i++) {
    normalIndex = io.gameRooms.NORMAL.closeRoomList.findIndex(
      (playersSocketId) => playersSocketId.player1SocketId === socket.id
    );

    if (normalIndex > -1) {
      targetId = io.gameRooms.NORMAL.closeRoomList[normalIndex].player2SocketId;
      break;
    }

    normalIndex = io.gameRooms.NORMAL.closeRoomList.findIndex(
      (playersSocketId) => playersSocketId.player2SocketId === socket.id
    );

    if (normalIndex > -1) {
      targetId = io.gameRooms.NORMAL.closeRoomList[normalIndex].player1SocketId;
      break;
    }
  }

  for (let i = 0; i < io.gameRooms.HARD.closeRoomList.length; i++) {
    hardIndex = io.gameRooms.HARD.closeRoomList.findIndex(
      (playersSocketId) => playersSocketId.player1SocketId === socket.id
    );

    if (hardIndex > -1) {
      targetId = io.gameRooms.HARD.closeRoomList[hardIndex].player2SocketId;
      break;
    }

    hardIndex = io.gameRooms.HARD.closeRoomList.findIndex(
      (playersSocketId) => playersSocketId.player2SocketId === socket.id
    );

    if (hardIndex > -1) {
      targetId = io.gameRooms.HARD.closeRoomList[hardIndex].player1SocketId;
      break;
    }
  }

  for (let i = 0; i < io.gameRooms.CUSTOM_MAP.closeRoomList.length; i++) {
    customMapIndex = io.gameRooms.CUSTOM_MAP.closeRoomList.findIndex(
      (playersSocketId) => playersSocketId.player1SocketId === socket.id
    );

    if (customMapIndex > -1) {
      targetId =
        io.gameRooms.CUSTOM_MAP.closeRoomList[customMapIndex].player2SocketId;
      break;
    }

    customMapIndex = io.gameRooms.CUSTOM_MAP.closeRoomList.findIndex(
      (playersSocketId) => playersSocketId.player2SocketId === socket.id
    );

    if (customMapIndex > -1) {
      targetId =
        io.gameRooms.CUSTOM_MAP.closeRoomList[customMapIndex].player1SocketId;
      break;
    }
  }

  if (easyIndex > -1) {
    io.gameRooms.EASY.closeRoomList.splice(easyIndex, 1);
  }
  if (normalIndex > -1) {
    io.gameRooms.NORMAL.closeRoomList.splice(easyIndex, 1);
  }
  if (hardIndex > -1) {
    io.gameRooms.HARD.closeRoomList.splice(easyIndex, 1);
  }
  if (customMapIndex > -1) {
    io.gameRooms.CUSTOM_MAP.closeRoomList.splice(customMapIndex, 1);
  }

  io.to(targetId).emit("leaveGame");
  socket.disconnect();
  // eslint-disable-next-line no-console
  console.log("❌ User Disconnected", socket.id);
}
