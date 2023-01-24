import { Component, createSignal } from 'solid-js';
import { createEffect } from 'solid-js';
import { onCleanup, onMount } from 'solid-js';
import gameList from './gameList';
import styles from './Game.module.css';
import { useParams } from '@solidjs/router';
import {
  PeerCommand,
  PeerCommandKeyPayLoad,
  listenPeerCommand,
} from '../peerServer';

// @ts-ignore
import FCEUX from './fceux';
// @ts-ignore
import FCEUXWasmURL from '../assets/emulator/fceux.wasm';

const Game: Component = () => {
  const params = useParams();
  let controllerBits = 0;
  let [isReady, setIsReady] = createSignal(false);
  let fceux: any;
  let reqAnimationFrameTimer: any;

  createEffect(async () => {
    if (isReady() && fceux) {
      const gameInfo: any = gameList.find((game) => game.id === params.gameID);
      if (gameInfo) {
        controllerBits = 0;
        await fceux.reset();
        await fceux.downloadGame(gameInfo.url);
      } else {
        console.error('No game found');
      }
    }
  });

  const initEmulator = async () => {
    fceux = await FCEUX({ FCEUXWasmURL });
    await fceux.init('#nescanvas');
    fceux.setMuted(true);
  };

  const onPeerCommand = (peerCommand: PeerCommand) => {
    if (peerCommand.name === 'key' && isReady()) {
      const keyCommand: PeerCommandKeyPayLoad = peerCommand.payload;
      for (let i = 0; i < keyCommand.k.length; i++) {
        const key = keyCommand.k[i] + (keyCommand.p === 1 ? 0 : 8);
        if (keyCommand.s) {
          controllerBits |= 1 << key;
        } else {
          controllerBits &= ~(1 << key);
        }
      }
      fceux.setControllerBits(controllerBits);
    }
  };

  const updateLoop = () => {
    fceux.update();
    reqAnimationFrameTimer = requestAnimationFrame(updateLoop);
  };

  onMount(async () => {
    listenPeerCommand((peerCommand) => onPeerCommand(peerCommand));
    await initEmulator();
    setIsReady(true);
    updateLoop();
  });

  onCleanup(() => {
    fceux.reset();
    fceux = null;
    cancelAnimationFrame(reqAnimationFrameTimer);
  });

  return <canvas id="nescanvas" class={styles.Game}></canvas>;
};

export default Game;
