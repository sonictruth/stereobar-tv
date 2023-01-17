import { createSignal, createRoot } from 'solid-js';
import { Peer } from 'peerjs';
import gameList from './game/gameList';

const id = 'sbar-' + Math.random().toString(36).slice(8);
const gamepadURL =
  document.location.protocol +
  '//' +
  document.location.host +
  document.location.pathname +
  '#/gamepad/' +
  id;

function createPeerServer() {
  console.log('init');
  const [game, setGame] = createSignal<any>(null);
  const [key, setKey] = createSignal<any>(null);
  const connect = () => {
    let peerServer = new Peer(id, {
      debug: 0,
    });
    peerServer.on('error', (error) => {
      console.error('Error', error);
    });
    peerServer.on('disconnected', () => {
      console.log('disconnected');
    });
    peerServer.on('open', (id) => {
      console.log('Peer connection id:', id);
    });
    peerServer.on('connection', (conn) => {
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
        console.log(data);
        if (data.cmd === 'key') {
          setKey(data.event);
        }
        if(data.cmd === 'loadGame') {
          setGame(data.gameId);
        }
      });
    });
  };

  return { connect, gamepadURL, key, game };
}

export default createRoot(createPeerServer);
