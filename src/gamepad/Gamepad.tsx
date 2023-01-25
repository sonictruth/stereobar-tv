import { Component, For, Match, Switch } from 'solid-js';
import { createSignal } from 'solid-js';
import { onMount, onCleanup } from 'solid-js';
import { Peer } from 'peerjs';
import styles from './Gamepad.module.css';
import { useNavigate, useParams } from '@solidjs/router';
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
  const navigate = useNavigate();
  const [error, setError] = createSignal('');
  const [state, setState] = createSignal<State>(State.Login);
  const [gameList, setGameList] = createSignal(null);
  const [elapsed, setElapsed] = createSignal('');
  const [playerIndex, setPlayerIndex] = createSignal(1);
  const [pin, setPin] = createSignal(params.pin || '');

  let peerClient: any;
  let peerConnection: any;
  let pingTime = performance.now();

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
      // FIXME: Ordered ?
      reliable: true,
      ordered: true,
      _payload: {
        reliable: true,
        ordered: true,
        originator: true,
      },
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
      if (cmd.name === 'pong') {
        setElapsed((performance.now() - pingTime).toFixed(2) + 'ms');
      }
    });
  };

  const ping = () => {
    setElapsed('');
    pingTime = performance.now();
    peerConnection.send({ name: 'ping' });
  };

  onMount(() => {
    initPeer();
  });

  onCleanup(() => {
    peerClient.destroy();
  });

  const handleNesKey = (keyEvent: any) => {
    if (state() === State.Connected) {
      const keys = nesControllerMap[keyEvent.btn];
      let payload: PeerCommandKeyPayLoad = {
        s: keyEvent.pressed,
        k: keys,
        p: playerIndex(),
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
          <button
            onClick={() => {
              navigate('/gamepad/' + pin());
              document.location.reload();
            }}
          >
            OK
          </button>
        </Match>

        <Match when={state() === State.Login}>
          <input
            placeholder="PIN"
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
          <select
            class={styles.GameSelect}
            onInput={(e) => {
              loadGame(e.currentTarget.value);
            }}
          >
            <option selected disabled >
              -- Select Game --
            </option>
            <For each={gameList()}>
              {(game) => <option value={game.id}>{game.name}</option>}
            </For>
          </select>

          <div>
            <div>
              <div
                class={styles.GamePadButton}
                onClick={() => setPlayerIndex(playerIndex() === 1 ? 2 : 1)}
              >
                Switch to controller {playerIndex() === 1 ? 2 : 1}
              </div>
              <br />
              <div class={styles.GamePadButton} onClick={() => ping()}>
                Ping {elapsed()}
              </div>
            </div>
          </div>
          <GamepadButtons onNesKey={handleNesKey} />
        </Match>
      </Switch>
    </div>
  );
};

export default Gamepad;
