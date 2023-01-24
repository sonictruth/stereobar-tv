import { createSignal, createRoot } from 'solid-js';
import { Peer } from 'peerjs';
import { createSimpleEmitter } from '@solid-primitives/event-bus';
import gameList from './game/gameList';

export interface PeerCommand {
  name: 'loadGame' | 'gameList' | 'key' | 'message' | 'ping' | 'pong';
  payload?: any;
}

export interface PeerCommandKeyPayLoad {
  s: boolean;
  k: number[];
  p: number;
}

const [gamepadPin, setGamepadPin] = createSignal<any>(null);

const [listenPeerCommand, emitPeerCommand, clearPeerCommands] =
  createSimpleEmitter<PeerCommand>();

const gamepadURLPrefix =
  document.location.protocol +
  '//' +
  document.location.host +
  document.location.pathname +
  '#/gamepad/';
const serverPeerIDPrefix = 'sbar-j3k2lp1-';

const generatePin = () => {
  return Math.random().toString().substring(2, 6);
};

const connect = () => {
  const pin = generatePin();
  const serverPeerID = serverPeerIDPrefix + pin;
  let peerServer = new Peer(serverPeerID, {
    debug: 0,
  });
  peerServer.on('error', (error) => {
    console.error('Error', error);
  });
  peerServer.on('disconnected', () => {
    console.log('Disconected');
    setGamepadPin(null);
    peerServer.reconnect();
  });
  peerServer.on('open', (id) => {
    setGamepadPin(pin);
    const url = gamepadURLPrefix + pin;
    console.log('Gamepad URL:', url);
  });
  peerServer.on('connection', (conn) => {
    console.log('New Connection', conn.peer);
    conn.on('close', () => {
      console.log('Peer closed', conn.peer);
    });
    conn.on('error', (error) => {
      console.log('Peer error', conn.peer, error);
    });
    conn.on('open', () => {
      const peerCommand: PeerCommand = {
        name: 'gameList',
        payload: gameList,
      };
      conn.send(peerCommand);
    });
    conn.on('data', (data) => {
      emitPeerCommand(<PeerCommand>data);
    });
  });
};

const signals = createRoot(() => ({ gamepadPin }));

export {
  listenPeerCommand,
  serverPeerIDPrefix,
  gamepadURLPrefix,
  connect,
  signals,
};
