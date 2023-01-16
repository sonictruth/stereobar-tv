import type { Component } from 'solid-js';
import { Peer } from 'peerjs';
import styles from './Gamepad.module.css';

const Gamepad: Component = () => {
  let peerClient = new Peer({
    debug: 0,
  });
  peerClient.on('error', (error) => {
    console.log('Client Error', error);
  });

  peerClient.on('disconnected', () => {
    console.log('Disconnected');
  });

  peerClient.on('open', () => {
    const conn = peerClient.connect('ec17331b-xxx', {
      reliable: true,
    });
    conn.on('open', () => {
      console.log('open');
      conn.send('hello from client');
    });
    conn.on('data', (data) => {
      console.log(data);
    });
    conn.on('error', (error) => {
      console.log(error);
    });
    conn.on('close', () => {
      console.log('close');
    });
  });

  return <div>gamepad</div>;
};

export default Gamepad;
