import type { Component } from 'solid-js';
import { createEffect } from 'solid-js';
import styles from './App.module.css';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from '@solidjs/router';

import peerServer from './peerServer';

import Video from './video/Video';
import Gamepad from './gamepad/Gamepad';
import Game from './game/Game';

const App: Component = () => {
  const location = useLocation();
  const navigate = useNavigate();
  if (!location.pathname.includes('gamepad')) {
    peerServer.connect();
  }
  createEffect(() => {
    const cmd = peerServer.cmd();
    if (cmd && cmd.cmd === 'loadGame') {
      const gameId = cmd.gameId;
      if (gameId === '') {
        navigate('/video');
      } else {
        navigate('/game/' + gameId);
      }
    }
  });
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
