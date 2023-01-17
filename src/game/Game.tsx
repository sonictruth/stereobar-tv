import type { Component } from 'solid-js';
import { createEffect } from 'solid-js';
import { onCleanup, onMount } from 'solid-js';
import gameList from './gameList';
import styles from './Game.module.css';
import { useParams } from '@solidjs/router';
import peerServer from '../peerServer';
// @ts-ignore
import { WasmBoy } from 'wasmboy';

const WasmBoyJoypadState = {
  UP: false,
  RIGHT: false,
  DOWN: false,
  LEFT: false,
  A: false,
  B: false,
  SELECT: false,
  START: false,
};

const options = {
  gameboyFrameRate: 30,
  // gbcColorizationPalette
  graphicsBatchProcessing: false,
  graphicsDisableScanlineRendering: false,
  headless: false,
  isAudioEnabled: false,
  enableBootROMIfAvailable: true,
  isGbcColorizationEnabled: true,
  isGbcEnabled: true,

  maxNumberOfAutoSaveStates: 10,
  onLoadedAndStarted: null,
  onPause: null,
  onPlay: null,
  onReady: null,
  saveStateCallback: null,
  tileCaching: false,
  tileRendering: false,
  timersBatchProcessing: false,
  updateAudioCallback: null,
  updateGraphicsCallback: null,
};

const Game: Component = () => {
  const params = useParams();
  let canvas: any;

  createEffect(() => {
    if (params.gameID) {
      const game: any = gameList.find((game) => game.id === params.gameID);
      loadGame(game.url);
    }
  });

  createEffect(() => {
    const newState = {
      ...WasmBoyJoypadState,
      ...peerServer.key(),
    };
    console.log(newState)
    WasmBoy.setJoypadState(newState);
  });

  const loadGame = async (url: string) => {
    console.log('load');
    await WasmBoy.disableDefaultJoypad();
    await WasmBoy.config(options, canvas);
    await WasmBoy.reset();
    await WasmBoy.loadROM(url);
    await WasmBoy.play();
  };

  onMount(async () => {});
  onCleanup(async () => {
    await WasmBoy.reset();
  });

  return <canvas ref={canvas} class={styles.Game}></canvas>;
};

export default Game;
