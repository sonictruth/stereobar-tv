import { Component, For } from 'solid-js';
import { createSignal } from 'solid-js';
import { onMount, onCleanup } from 'solid-js';
import { Peer } from 'peerjs';

// @ts-ignore
import NESCntlr from 'nes-cntlr';

let eventsArr = [
  'up-left',
  'up',
  'up-right',
  'right',
  'left',
  'down-left',
  'down',
  'down-right',
  'b',
  'a',
  'select',
  'start',
];
import styles from './Gamepad.module.css';

import { useParams } from '@solidjs/router';

const Gamepad: Component = () => {
  const params = useParams();
  const [gameList, setGameList] = createSignal(null);
  const serverId = params.serverID;
  let playerVirtualController: any;
  let peerClient: any;
  let peerConnection: any;

  const loadGame = (gameId: string) => {
    if (peerConnection) {
      peerConnection.send({ cmd: 'loadGame', gameId });
    }
  };
  const onKeyPress = (e: any) => {
    if (peerConnection) {
      let event = {};
      const btn = e.detail.btn;
      switch (btn) {
        case 'up-left':
          event = {
            UP: e.detail.pressed,
            LEFT: e.detail.pressed,
          };
          break;
        case 'up-right':
          event = {
            UP: e.detail.pressed,
            RIGHT: e.detail.pressed,
          };
          break;
        case 'down-left':
          event = {
            DOWN: e.detail.pressed,
            LEFT: e.detail.pressed,
          };
          break;
        case 'down-right':
          event = {
            DOWN: e.detail.pressed,
            RIGHT: e.detail.pressed,
          };
          break;
        case 'a':
          event = {
            A: e.detail.pressed,
          };
          break;
        case 'b':
          event = {
            B: e.detail.pressed,
          };
          break;
        case 'select':
          event = {
            SELECT: e.detail.pressed,
          };
          break;
        case 'start':
          event = {
            START: e.detail.pressed,
          };
          break;
        case 'up':
          event = {
            UP: e.detail.pressed,
          };
          break;
        case 'down':
          event = {
            DOWN: e.detail.pressed,
          };
          break;
        case 'left':
          event = {
            LEFT: e.detail.pressed,
          };
          break;
        case 'right':
          event = {
            RIGHT: e.detail.pressed,
          };
          break;
      }
      peerConnection.send({ cmd: 'key', event });
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
      console.error('Client Error', error.message);
    });

    peerClient.on('disconnected', () => {
      console.log('Disconnected');
    });

    peerClient.on('open', () => {
      peerConnection = peerClient.connect(serverId, {
        reliable: true,
      });
      peerConnection.on('open', () => {
        console.log('open');
        peerConnection.send({ cmd: 'pong' });
      });
      peerConnection.on('data', (data: any) => {
        if (data.cmd === 'gameList') {
          setGameList(data.gameList);
        }
      });
      peerConnection.on('error', (error: any) => {
        console.log(error);
      });
      peerConnection.on('close', () => {
        console.log('close');
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
    <div>
      <For each={gameList()}>
        {(game, i) => (
          <button onClick={() => loadGame(game.id)}>{game.name}</button>
        )}
      </For>
      <button onClick={() => loadGame('')}>Close</button>
    </div>
  );
};

export default Gamepad;
