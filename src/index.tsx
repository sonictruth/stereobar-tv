/* @refresh reload */
import 'whatwg-fetch';
import { render } from 'solid-js/web';
import { Router, hashIntegration } from '@solidjs/router';
import { Peer } from 'peerjs';

/*
const peerServer = new Peer();
peerServer.on('open', (id) => {
    console.log(id);
});
peerServer.on('connection', (connection) => {
    console.log(connection);
});

const peerClient = new Peer();
*/

import './index.css';
import App from './App';

render(
  () => (
    <Router source={hashIntegration()}>
      <App />
    </Router>
  ),
  document.getElementById('root') as HTMLElement,
);
