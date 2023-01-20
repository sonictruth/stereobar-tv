import type { Component } from 'solid-js';
import { createEffect } from 'solid-js';
import { onCleanup, onMount } from 'solid-js';
import gameList from './gameList';
import styles from './Game.module.css';
import { useParams } from '@solidjs/router';
import { PeerCommand, PeerCommandKeyPayLoad, listenPeerCommand } from '../peerServer';
import getRomBinary from './getRomBinary';
// @ts-ignore
import jsnes from 'jsnes';

const screenWidth = 256;
const screenHeight = 240;

const Game: Component = () => {
  const params = useParams();
  let canvasRef: HTMLCanvasElement | undefined;
  let context: CanvasRenderingContext2D | null;
  let imageData: ImageData | null;
  let buf: ArrayBuffer; //= new ArrayBuffer(imageData.data.length);
  let buf8: Uint8ClampedArray; // = new Uint8ClampedArray(buf);
  let buf32: Uint32Array; // = new Uint32Array(buf);
  let isReady = false;

  let nesEmulator: any;
  let reqAnimationFrameTimer: any;

  createEffect(async () => {
    if (params.gameID) {
      const game: any = gameList.find((game) => game.id === params.gameID);
      if (game) {
        await loadGame(game.url);
      } else {
        console.error('No game found');
      }
    }
  });

  const loadGame = async (url: string) => {
    isReady = false;
    const romData = await getRomBinary(url);
    console.log(nesEmulator);
    nesEmulator.loadROM(romData);
    isReady = true;
  };

  const onPeerCommand = (peerCommand: PeerCommand) => {
    if (peerCommand.name === 'key' && isReady) {
      const keyCommand:PeerCommandKeyPayLoad = peerCommand.payload;
      for(let i = 0; i < keyCommand.k.length; i++) {
        if(keyCommand.s) {
          console.log(keyCommand.k[i]);
          nesEmulator.buttonDown(keyCommand.p, keyCommand.k[i]);
        } else {

          nesEmulator.buttonUp(keyCommand.p, keyCommand.k[i]);
        }
      }
    }
  };

  const mainEmulationLoop = () => {
    if (isReady) {
      nesEmulator.frame();
    }
    reqAnimationFrameTimer = requestAnimationFrame(mainEmulationLoop);
  };

  const onFrame = (frameBuffer: any) => {
    let i = 0;
    for (var y = 0; y < screenHeight; ++y) {
      for (var x = 0; x < screenWidth; ++x) {
        i = y * 256 + x;
        // Convert pixel from NES BGR to canvas ABGR
        buf32[i] = 0xff000000 | frameBuffer[i]; // Full alpha
      }
    }
    if (imageData && context) {
      imageData.data.set(buf8);
      context.putImageData(imageData, 0, 0);
    }
  };

  const initCanvas = () => {
    if (canvasRef) {
      context = canvasRef.getContext('2d');
      if (context) {
        context.fillStyle = 'black';
        context.fillRect(0, 0, screenWidth, screenHeight);
        imageData = context?.getImageData(0, 0, screenWidth, screenHeight);
        buf = new ArrayBuffer(imageData.data.length);
        buf8 = new Uint8ClampedArray(buf);
        buf32 = new Uint32Array(buf);
        for (var i = 0; i < buf32.length; ++i) {
          buf32[i] = 0xff000000;
        }
      }
    }
  };

  onMount(() => {
    initCanvas();
    listenPeerCommand((peerCommand) => onPeerCommand(peerCommand));
    nesEmulator = new jsnes.NES({
      preferredFrameRate: 30,
      onFrame: onFrame,
      onStatusUpdate: console.log,
    });
    mainEmulationLoop();
  });

  onCleanup(() => {
    cancelAnimationFrame(reqAnimationFrameTimer);
    nesEmulator = null;
  });

  return (
    <canvas
      width={screenWidth}
      height={screenHeight}
      ref={canvasRef}
      class={styles.Game}
    ></canvas>
  );
};

export default Game;
