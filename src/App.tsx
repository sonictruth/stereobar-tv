import type { Component } from 'solid-js';

import styles from './App.module.css';
import { Routes, Route, Navigate } from '@solidjs/router';
import Video from './video/Video';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <Routes>
        <Route path="/video" component={Video} />
        <Route path="/" element={<Navigate href='/video'/>} />
      </Routes>
    </div>
  );
};

export default App;
