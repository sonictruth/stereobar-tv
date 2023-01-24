import { Component, onCleanup, onMount } from 'solid-js';
import { createEffect } from 'solid-js';
import styles from './App.module.css';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from '@solidjs/router';

import type { PeerCommand } from './peerServer';
import { listenPeerCommand, connect as peerServerConnect } from './peerServer';

import Video from './video/Video';
import Gamepad from './gamepad/Gamepad';
import Game from './game/Game';

const App: Component = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const onPeerCommand = (peerCommand: PeerCommand) => {
    switch (peerCommand.name) {
      case 'loadGame':
        const gameID = peerCommand.payload;
        if (gameID === '') {
          navigate('/video');
        } else {
          navigate('/game/' + gameID);
        }
        break;
    }
  };

  onMount(() => {
    if (!location.pathname.includes('gamepad')) {
      peerServerConnect();
    }
    listenPeerCommand((peerCommand) => onPeerCommand(peerCommand));
  });
  
  onCleanup(() => {});
  return (
    <div class={styles.App}>
      <Routes>
        <Route path="/video" component={Video} />
        <Route path="/gamepad/:pin?" component={Gamepad} />
        <Route path="/game/:gameID" component={Game} />
        <Route path="/" element={<Navigate href="/gamepad" />} />
      </Routes>
    </div>
  );
};

export default App;
