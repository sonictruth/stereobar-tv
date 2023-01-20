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

const [listenPeerCommand, emitPeerCommand, clearPeerCommands] =
  createSimpleEmitter<PeerCommand>();

const generateID = () => {
  return 'sbar-' + Math.random().toString(36).slice(8);
};

const getGamepadURLFromID = (id: string) => {
  return (
    document.location.protocol +
    '//' +
    document.location.host +
    document.location.pathname +
    '#/gamepad/' +
    id
  );
};

function createPeerServer() {
  const [gamepadURL, setGamepadURL] = createSignal<any>(null);

  const connect = () => {
    let peerServer = new Peer(generateID(), {
      debug: 0,
    });
    peerServer.on('error', (error) => {
      console.error('Error', error);
    });
    peerServer.on('disconnected', () => {
      console.log('Disconected');
      peerServer.reconnect();
    });
    peerServer.on('open', (id) => {
      const url = getGamepadURLFromID(id);
      setGamepadURL(url);
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
  return { connect, gamepadURL };
}

export { listenPeerCommand };
export default createRoot(createPeerServer);
