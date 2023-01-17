import type { Component } from 'solid-js';
import { createSignal, onCleanup, onMount } from 'solid-js';
import styles from './Video.module.css';
import VideoBackground from './VideoBackground';
import VideoTicker from './VideoTicker';
import Spotify from './Spotify';
import animations from './animations';
import peerServer from '../peerServer';

const spotify = new Spotify();
const defaultLoopIntervalMs = 20000; //20000;
const maxLoopIntervalIfProgressMs = 40000;

const sleep = async (ms: number): Promise<any> => {
  return new Promise((resolve) => {
    let id: any;
    id = setTimeout(() => resolve(id), ms);
  });
};

const redirectToLogin = () => {
  document.location.href = spotify.getLoginURL();
};

const Video: Component = () => {
  const [isValidToken, setIsValidToken] = createSignal<any>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = createSignal<any>(null);
  const [titleClass, setTitleClass] = createSignal(styles.Title);
  const [error, setError] = createSignal('');
  let lastAnimation: any = null;
  let timeoutID: any = null;

  const updaterLoop = async () => {
    let intervalMs = defaultLoopIntervalMs;
    try {
      const current = await spotify.getCurrentlyPlayingSong();
      setCurrentlyPlaying(current);
      if (current) {
        const isPlaying = current.is_playing;
        if (isPlaying) {
          const progressMs = current.progress_ms;
          const durationMs = current.item.duration_ms;
          intervalMs = durationMs - progressMs + 1000;
          intervalMs = Math.min(maxLoopIntervalIfProgressMs, intervalMs);
        }
      }
    } catch (error) {
      console.error(error);
    }
    timeoutID = setTimeout(() => updaterLoop(), intervalMs);
  };

  const animateTitle = async () => {
    if (lastAnimation) {
      const outAnimation = lastAnimation.replace('$dir', 'Out');
      setTitleClass(styles.Title + ' animated ' + outAnimation);
      await sleep(1000);
    }
    const randomAnim =
      animations[Math.floor(Math.random() * animations.length)];
    const inAnimation = randomAnim.replace('$dir', 'In');
    lastAnimation = randomAnim;
    setTitleClass(styles.Title + ' animated ' + inAnimation);
  };
  const animationTimer = setInterval(() => animateTitle(), 10000);
  animateTitle();

  onMount(async () => {
    const code = new URLSearchParams(document.location.search).get('code');
    try {
      if (code) {
        const password = prompt('Token save password', '') || '';
        await spotify.saveRefresToken(code, password);
      }
      const isValid = await spotify.isValidRefreshToken();
      setIsValidToken(isValid);
      updaterLoop();
    } catch (error) {
      setIsValidToken(false);
      setError(JSON.stringify(error));
    }
  });

  onCleanup(() => {
    clearTimeout(timeoutID);
    clearInterval(animationTimer);
  });

  return (
    <div class={styles.Video}>
      <div class={styles.GameLink}>
        <a href={peerServer.gamepadURL}>
          <img
            src={
              'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' +
              encodeURIComponent(peerServer.gamepadURL)
            }
          />
        </a>
      </div>
      <div class={titleClass()}>Stereo Bar TV</div>
      <VideoBackground />
      <VideoTicker currentlyPlaying={currentlyPlaying()} />
      {isValidToken() === false && (
        <div class={styles.Login}>
          {error()} <br />
          <button onClick={redirectToLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default Video;
