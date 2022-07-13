import app from './ExpressApp.js';
import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import { PacManGame } from './utilities/index.js';
import Chance from 'chance';

const chance = new Chance();
const server = http.createServer(app);
const PORT = 3000;
const io = new Server(server);

const lobbies = {};
const map = JSON.parse(fs.readFileSync(path.resolve('src/backend/assets/map.json')));
const findPlayer = ({ lobby, playerKey }) => lobbies[lobby].game.players.find(({ key }) => key === playerKey);

const sendCharacterAssignments = ({ lobby }) => {
  const reducedPlayers = lobbies[lobby].game.players.map((player) => player.reduce());
  io.to(lobby).emit('characterAssignment', reducedPlayers);
};

const gameUpdateCallback = (gameData, { lobby }) => {
  io.to(lobby).emit('game', gameData);
};

const gameEndCallback = (gameData, { lobby }) => {
  io.to(lobby).emit('gameEnd', gameData);
};

const startGame = (game, socket) => {
  if (!game.interval && !game.isOver) {
    const sendUpdate = (gameData) => gameUpdateCallback(gameData, socket);
    const sendGameOver = (gameData) => gameEndCallback(gameData, socket);
    game.start(sendUpdate, sendGameOver);
  }
};

io.on('connection', (socket) => {
  socket.on('getLobbies', () => {
    socket.emit('lobbies', (io.sockets.adapter.rooms));
  });

  socket.on('joinLobby', ({ username, lobby, isCreatingPrivateLobby }) => {
    socket.username = username;

    if (!lobby && !isCreatingPrivateLobby) {
      for (const lobbyName in lobbies) {
        const currentLobby = lobbies[lobbyName];
        if (currentLobby.sockets.length < 5 && !currentLobby.isPrivate) {
          socket.join(lobbyName);
          socket.lobby = lobbyName;
          currentLobby.sockets.push(socket);
          break;
        }
      }

      if (!socket.lobby) {
        const lobby = chance.guid();
        socket.join(lobby);
        socket.lobby = lobby;
        lobbies[lobby] = {
          sockets: [socket]
        };
      }
    }
    else {
      if (isCreatingPrivateLobby) {
        lobby = chance.guid();
      }

      socket.join(lobby);
      socket.lobby = lobby;

      if (!lobbies[lobby]) {
        lobbies[lobby] = {
          sockets: [socket],
          isPrivate: isCreatingPrivateLobby
        };
      }
    }

    if (!(lobbies[socket.lobby].game)) {
      lobbies[socket.lobby].game = new PacManGame({ map });
    }

    // TODO: need to change this when there is only one character to choose
    // Consider adding a "spectate" option that is visible when there is already at least one player present

    socket.emit('joinedLobby', {
      lobbyName: socket.lobby,
      game: lobbies[socket.lobby].game.reduce({ includeItems: true })
    });
  });
  
  socket.on('selectCharacter', (characterKey) => {
    const game = lobbies[socket.lobby].game;
    const player = game.players.find((player) => player.key === characterKey);
    if (player.isCPU) {
      player.id = socket.id;
      player.isCPU = false;
      player.username = socket.username;
      socket.playerKey = characterKey;
    }

    sendCharacterAssignments(socket);
  });

  socket.on('movePlayer', (movement) => {
    const player = findPlayer(socket);
    player.setMovement(movement);
  });

  socket.on('readyToPlay', () => {
    const lobby = lobbies[socket.lobby];
    
    const player = lobby.game.players.find(({ id }) => id === socket.id);
    player.isReady = true;
    socket.isReady = true;


    let allPlayersReady = true;
    for (const socket of lobby.sockets) {
      if (!socket.isReady) {
        allPlayersReady = false;
      }
    }

    if (allPlayersReady) {
      const game = lobbies[socket.lobby].game;
      startGame(game, socket);
    }
    else {
      sendCharacterAssignments(socket);
    }
  });

  // TODO: delete
  socket.on('gameEnd', () => {
    lobbies[socket.lobby].game.end();
  });

  socket.on('disconnect', () => {
    if (!socket.lobby) return;

    socket.leave(socket.lobby);

    const lobby = lobbies[socket.lobby];

    // remove this socket from lobby.sockets
    const socketIndex = lobby.sockets.findIndex(({ id }) => id === socket.id);
    lobby.sockets.splice(socketIndex, 1);

    if (!(lobby.sockets.length)) {
      if (lobby.game.interval && !lobby.game.isOver) {
        lobby.game?.end();
      }

      delete lobbies[socket.lobby];
      return;
    }

    const players = lobby.game.players;
    const currentPlayer = players.find(({ username }) => username === socket.username);
    if (currentPlayer) {
      delete currentPlayer.username;
      delete currentPlayer.id;
      delete currentPlayer.isReady;
      currentPlayer.isCPU = true;
    }

    // send updated players to users
    sendCharacterAssignments(socket);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
