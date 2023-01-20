import { createSignal, createRoot } from 'solid-js';
import { Peer } from 'peerjs';
import gameList from './game/gameList';

const generateID = () => {
  return 'sbar-' + Math.random().toString(36).slice(8);
};

const getGamepadURLFromID = (id: string) => {
  return document.location.protocol +
    '//' +
    document.location.host +
    document.location.pathname +
    '#/gamepad/' +
    id;
};

function createPeerServer() {
  const [gamepadURL, setGamepadURL] = createSignal<any>(null);
  const [peerID, setPeerID] = createSignal<any>(null);
  const [cmd, setCmd] = createSignal<any>(null);

  const connect = () => {
    setPeerID(generateID());

    let peerServer = new Peer(peerID(), {
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
      const url = getGamepadURLFromID(peerID());
      setGamepadURL(url);
      console.log('Gamepad URL:', url);
    });
    peerServer.on('connection', (conn) => {
      console.log('New Connection', conn.peer);
      conn.on('close', () => {
        console.log('close');
      });
      conn.on('error', (error) => {
        console.log('Error', error);
      });
      conn.on('open', () => {
        conn.send({ cmd: 'gameList', gameList });
      });
      conn.on('data', (data: any) => {
        setCmd(data);
      });
    });
  };
  return {connect, gamepadURL, cmd };
}

export default createRoot(createPeerServer);
