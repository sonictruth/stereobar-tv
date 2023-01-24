import { Component, Show } from 'solid-js';
import styles from './GamepadConnectionInfo.module.css';
import { signals as peerServerSignals, gamepadURLPrefix } from '../peerServer';

const GamepadConnectionInfo: Component = () => {
  return (
    <div class={styles.GamepadConnectionInfo}>
      <Show when={peerServerSignals.gamepadPin()} fallback={<div>Loading</div>}>
        <a href={gamepadURLPrefix + peerServerSignals.gamepadPin()}>
          {peerServerSignals.gamepadPin()}
        </a>
      </Show>
    </div>
  );
};

export default GamepadConnectionInfo;
