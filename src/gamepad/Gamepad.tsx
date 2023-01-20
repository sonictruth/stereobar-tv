import { Component, For } from 'solid-js';
import { createSignal } from 'solid-js';
import { onMount, onCleanup } from 'solid-js';
import { Peer } from 'peerjs';
import styles from './Gamepad.module.css';
import './custom.css';
import { useParams } from '@solidjs/router';
import { PeerCommand, PeerCommandKeyPayLoad } from '../peerServer';

// @ts-ignore
import NESCntlr from 'nes-cntlr';

let eventsArr = [
  'up-left',
  'up-right',
  'down-left',
  'down-right',
  'up',
  'right',
  'left',
  'down',
  'b',
  'a',
  'select',
  'start',
];

let jsNesControllerMap: any = {
  a: [0],
  b: [1],
  select: [2],
  start: [3],
  up: [4],
  down: [5],
  left: [6],
  right: [7],
  'up-left': [4, 6],
  'up-right': [4, 7],
  'down-left': [5, 6],
  'down-right': [5, 7],
};

const Gamepad: Component = () => {
  const params = useParams();
  const [gameList, setGameList] = createSignal(null);
  const [playerIndex, setPlayerIndex] = createSignal(1);
  const serverId = params.serverID;
  let playerVirtualController: any;
  let peerClient: any;
  let peerConnection: any;

  const loadGame = (gameID: string) => {
    if (peerConnection) {
      const cmd: PeerCommand = { name: 'loadGame', payload: gameID };
      peerConnection.send(cmd);
    }
  };

  const showFullScreen = () => {
    document.body.requestFullscreen();
    screen.orientation.lock('landscape-primary');
  };

  const onKeyPress = (keyEvent: any) => {
    if (peerConnection) {
      const key = jsNesControllerMap[keyEvent.detail.btn];
      let payload: PeerCommandKeyPayLoad = {
        s: keyEvent.detail.pressed,
        p: playerIndex(),
        k: key,
      };
      const cmd: PeerCommand = { name: 'key', payload };
      peerConnection.send(cmd);
      if (keyEvent.detail.pressed && navigator.vibrate) {
        navigator.vibrate(60);
      }
    }
  };

  onMount(() => {
    playerVirtualController = new NESCntlr({
      virtual: 'always',
    });
    eventsArr.forEach((event) => {
      document.addEventListener(`player1:${event}`, onKeyPress);
    });
    playerVirtualController.init();

    peerClient = new Peer({
      debug: 0,
    });

    peerClient.on('error', (error: any) => {
      console.error('Peer Error', error.message);
    });

    peerClient.on('disconnected', () => {
      console.log('Peer Disconnected');
    });

    peerClient.on('open', () => {
      peerConnection = peerClient.connect(serverId, {
        reliable: true,
      });
      peerConnection.on('error', (error: any) => {
        console.error('Connection error', error);
      });
      peerConnection.on('close', () => {
        console.log('Connection closed');
      });
      peerConnection.on('open', () => {
        const cmd: PeerCommand = { name: 'pong' };
        peerConnection.send(cmd);
      });
      peerConnection.on('data', (cmd: PeerCommand) => {
        if (cmd.name === 'gameList') {
          setGameList(cmd.payload);
        }
      });
    });
  });

  onCleanup(() => {
    eventsArr.forEach((event) => {
      document.removeEventListener(`player1:${event}`, onKeyPress);
    });
    playerVirtualController.destroyVirtualCntlr();
    playerVirtualController = null;
    peerClient.destroy();
  });

  return (
    <div class={styles.GamePad}>
      <div>Stereo BAR Player {playerIndex()}</div>
      <For each={gameList()}>
        {(game) => (
          <div class={styles.GamePadButton} onClick={() => loadGame(game.id)}>
            {game.name}
          </div>
        )}
      </For>
      <div>
        <div>
          <div
            class={styles.GamePadButton}
            onClick={() => setPlayerIndex(playerIndex() === 1 ? 2 : 1)}
          >
            Play as {playerIndex() === 1 ? 2 : 1}
          </div>
        </div>
        <div class={styles.GamePadButton} onClick={() => loadGame('')}>
          Unload
        </div>
        <div class={styles.GamePadButton} onClick={() => showFullScreen()}>
          Fullscreen
        </div>
      </div>
    </div>
  );
};

export default Gamepad;
