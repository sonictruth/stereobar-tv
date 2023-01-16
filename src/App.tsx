import type { Component } from 'solid-js';
import styles from './App.module.css';
import { Routes, Route, Navigate, useLocation, useNavigate } from '@solidjs/router';
import { Peer } from 'peerjs';

import Video from './video/Video';
import Gamepad from './gamepad/Gamepad';
import Game from './game/Game';

const App: Component = () => {
  const location = useLocation();
  const navigate = useNavigate();
  if (location.pathname !== '/gamepad') {
    let peerServer = new Peer('ec17331b-xxx', {
      debug: 0,
    });
    peerServer.on('error', (error) => {
      console.log('Error', error);
    });
    peerServer.on('disconnected', () => {
      console.log('disconnected');
    });
    peerServer.on('connection', (conn) => {
      conn.on('close', () => {
        console.log('close');
      });
      conn.on('error', (error) => {
        console.log('error', error);
      });
      conn.on('open', () => {
        conn.send('hello from server');
      });
      conn.on('data', (data) => {
        console.log('Server', data);
        navigate('/game');
      });
    });
  }
  return (
    <div class={styles.App}>
      <Routes>
        <Route path="/video" component={Video} />
        <Route path="/gamepad" component={Gamepad} />
        <Route path="/game" component={Game} />
        <Route path="/" element={<Navigate href="/video" />} />
      </Routes>
    </div>
  );
};

export default App;
