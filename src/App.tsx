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

import peerServer, { PeerCommand, listenPeerCommand } from './peerServer';

import Video from './video/Video';
import Gamepad from './gamepad/Gamepad';
import Game from './game/Game';

const App: Component = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const onPeerCommand = (peerCommand: PeerCommand) => {
     if(peerCommand.name === 'loadGame') {
        const gameID = peerCommand.payload;
        if (gameID === '') {
          navigate('/video');
        } else {
          navigate('/game/' + gameID);
        }
     }
  };

  onMount(() => {
    if (!location.pathname.includes('gamepad')) {
      peerServer.connect();
    }
    listenPeerCommand((peerCommand) => onPeerCommand(peerCommand));
  });
  onCleanup(() => {});
  return (
    <div class={styles.App}>
      <Routes>
        <Route path="/video" component={Video} />
        <Route path="/gamepad/:serverID" component={Gamepad} />
        <Route path="/game/:gameID" component={Game} />
        <Route path="/" element={<Navigate href="/video" />} />
      </Routes>
    </div>
  );
};

export default App;
