import app from './ExpressApp.js';
import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import { PacManGame } from './utilities/index.js';
import PacMan from './utilities/Players/PacMan.js';

const server = http.createServer(app);
const PORT = 3000;
const io = new Server(server);

const games = {};
// const lobbies = {};
const map = JSON.parse(fs.readFileSync(path.resolve('src/backend/assets/map.json')));

io.on('connection', (socket) => {
  console.log(`[${socket.id}] connected`);

  socket.on('getLobbies', () => {
    console.log('sending lobbies');
    socket.emit('lobbies', (io.sockets.adapter.rooms));
  });

  socket.on('joinLobby', (lobby) => {
    socket.join(lobby);
    socket.lobby = lobby;
    console.log(`[${socket.id}] joined lobby "${lobby}"`);

    socket.emit('joinedLobby'); // todo: delete or change
  });

  socket.on('loadGame', () => {
    if (!socket.lobby) return;

    const game = new PacManGame({ map });
    games[socket.lobby] = game;

    socket.emit('gameLoaded', {
      players: game.players.map((player) => player.reduce()),
      items: game.items,
      textElements: game.textElements
    });
  });

  socket.on('startGame', () => {
    console.log(`[${socket.lobby}] starting game`);
    games[socket.lobby].start((gameData) => {
      socket.emit('game', gameData);
    });
  });

  socket.on('movePlayer', (movement) => {
    // TODO: find player in game
    const player = games[socket.lobby].players.find((player) => player instanceof PacMan);
    player.setMovement(movement);
  });

  socket.on('disconnect', () => {
    console.log(`[${socket.id}] disconnected`);
    socket.leave(socket.lobby);
  });
});

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
