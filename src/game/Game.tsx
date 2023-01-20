import type { Component } from 'solid-js';
import { createEffect } from 'solid-js';
import { onCleanup, onMount } from 'solid-js';
import gameList from './gameList';
import styles from './Game.module.css';
import { useParams } from '@solidjs/router';
import peerServer from '../peerServer';

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
    console.log(peerServer.cmd());
  });

  const loadGame = async (url: string) => {
    console.log('load game', url);
  };

  onMount(async () => {});
  onCleanup(async () => {});

  return <canvas ref={canvas} class={styles.Game}></canvas>;
};

export default Game;
