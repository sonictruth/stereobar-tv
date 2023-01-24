import { Component, For, Match, Switch } from 'solid-js';
import { createSignal } from 'solid-js';
import { onMount, onCleanup } from 'solid-js';
import { Peer } from 'peerjs';
import styles from './Gamepad.module.css';
import { useParams } from '@solidjs/router';
import type { PeerCommand, PeerCommandKeyPayLoad } from '../peerServer';
import { serverPeerIDPrefix } from '../peerServer';
import GamepadButtons from './GamepadButtons';

enum State {
  Error = 'error',
  Loading = 'loading',
  Connected = 'connected',
  Login = 'login',
}

let nesControllerMap: any = {
  a: [0],
  b: [1],
  select: [2],
  start: [3],
  up: [4],
  down: [5],
  left: [6],
  right: [7],
  'up-left': [4, 6],
  'up-right': [4, 7],
  'down-left': [5, 6],
  'down-right': [5, 7],
};

const Gamepad: Component = () => {
  const params = useParams();
  const [error, setError] = createSignal('');
  const [state, setState] = createSignal<State>(State.Login);
  const [gameList, setGameList] = createSignal(null);
  const [playerIndex, setPlayerIndex] = createSignal(1);
  const [pin, setPin] = createSignal(params.pin || '');

  let playerVirtualController: any;
  let peerClient: any;
  let peerConnection: any;

  const loadGame = (gameID: string) => {
    if (peerConnection) {
      const cmd: PeerCommand = { name: 'loadGame', payload: gameID };
      peerConnection.send(cmd);
    }
  };

  const switchFullScreen = async () => {
    try {
      document.body.requestFullscreen();
      await screen.orientation.lock('landscape-primary');
    } catch (error) {
      console.error(error);
    }
  };

  const initPeer = () => {
    setState(State.Loading);
    peerClient = new Peer({
      debug: 0,
    });

    peerClient.on('error', (error: any) => {
      console.error('Peer Error', error.message);
      setState(State.Error);
      setError(error.message);
    });

    peerClient.on('disconnected', () => {
      setState(State.Error);
      setError('Disconnected');
    });

    peerClient.on('open', () => {
      setState(State.Login);
    });
  };

  const connectPeer = () => {
    setState(State.Loading);
    peerConnection = peerClient.connect(serverPeerIDPrefix + pin(), {
      reliable: true,
    });
    peerConnection.on('error', (error: any) => {
      console.error('Connection error', error);
      setState(State.Error);
      setError(error);
    });
    peerConnection.on('close', () => {
      setState(State.Error);
      setError('Connection closed');
    });
    peerConnection.on('open', async () => {
      setState(State.Connected);
      await switchFullScreen();
      const cmd: PeerCommand = { name: 'pong' };
      peerConnection.send(cmd);
    });
    peerConnection.on('data', (cmd: PeerCommand) => {
      if (cmd.name === 'gameList') {
        setGameList(cmd.payload);
      }
    });
  };

  onMount(() => {
    initPeer();
  });

  onCleanup(() => {
    peerClient.destroy();
  });

  const handleNesKey = (keyEvent: any) => {
    if (state() === State.Connected) {
      const key = nesControllerMap[keyEvent.detail.btn];
      let payload: PeerCommandKeyPayLoad = {
        s: keyEvent.detail.pressed,
        p: playerIndex(),
        k: key,
      };
      const cmd: PeerCommand = { name: 'key', payload };
      peerConnection.send(cmd);
    }
  };

  return (
    <div class={styles.GamePad}>
      <div>Stereo BAR Gamepad</div>
      <Switch>
        <Match when={state() === State.Loading}>
          <div>Loading...</div>
        </Match>

        <Match when={state() === State.Error}>
          <div>{error()}</div>
          <button onClick={() => setState(State.Login)}>OK</button>
        </Match>

        <Match when={state() === State.Login}>
          <input
            type="text"
            size="4"
            onInput={(e: any) => {
              setPin(e.target.value);
            }}
            value={pin()}
          />
          <button onClick={() => connectPeer()}>OK</button>
        </Match>

        <Match when={state() === State.Connected}>
          <For each={gameList()}>
            {(game) => (
              <div
                class={styles.GamePadButton}
                onClick={() => loadGame(game.id)}
              >
                {game.name}
              </div>
            )}
          </For>
          <div>
            <div>
              <div
                class={styles.GamePadButton}
                onClick={() => setPlayerIndex(playerIndex() === 1 ? 2 : 1)}
              >
                Play as {playerIndex() === 1 ? 2 : 1}
              </div>
            </div>
            <div
              class={styles.GamePadButton}
              onClick={() => setState(State.Login)}
            >
              Unload
            </div>
          </div>
          <GamepadButtons onNesKey={(keyEvent:any) => handleNesKey(keyEvent)} />
        </Match>
      </Switch>
    </div>
  );
};

export default Gamepad;
/*
  
       */
