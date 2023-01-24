import { Component } from 'solid-js';
import { createSignal, onCleanup, onMount } from 'solid-js';
import styles from './Video.module.css';

import VideoBackground from './VideoBackground';
import TrackInfo from './TrackInfo';
import GamepadConnectionInfo from './GamepadConnectionInfo';

const animateTracksIntervalMs = 5000;
const updateTracksIntervalMs = 25000;

const lastFMApiURL = 'https://www.sonicpix.ro/lastfm.php';

const Video: Component = () => {
  let animateTracksTimer: any, updateTracksTimer: any, sleepTimer: any;
  let lastTrackEl: HTMLDivElement | undefined;
  let currentTrackEl: HTMLDivElement | undefined;
  const [error, setError] = createSignal<any>(null);
  const [tracks, setTracks] = createSignal<any[]>([]);
  const [currentTrack, setCurrentTrack] = createSignal<any>(null);
  const [lastTrack, setLastTrack] = createSignal<any>(null);

  const sleep = async (ms: number): Promise<any> => {
    return new Promise((resolve) => {
      sleepTimer = setTimeout(() => resolve(0), ms);
    });
  };

  const updateTracks = async () => {
    try {
      const response = await fetch(lastFMApiURL);
      const newTracks = await response.json();
      setTracks(newTracks);
    } catch (error) {
      console.error(error);
    }
  };

  const animateTracks = async () => {
    let sleepTime = animateTracksIntervalMs;
    if (lastTrackEl) {
      lastTrackEl.className = '';
      void lastTrackEl.offsetWidth;
      lastTrackEl.classList.add(styles.TrackSlideOut);
    }
    if (currentTrackEl) {
      currentTrackEl.className = '';
      void currentTrackEl.offsetWidth;
      currentTrackEl.classList.add(styles.TrackSlideIn);
    }
    const trackList: any[] = tracks();
    const current = currentTrack();
    if (trackList.length > 0) {
      if (current === null) {
        setCurrentTrack(trackList[0]);
      } else {
        const currentIndex = trackList.findIndex(
          (track) => track.id === current.id,
        );
        let nextIndex = currentIndex + 1;
        if (currentIndex === -1 || nextIndex > trackList.length - 1) {
          nextIndex = 0;
        }
        setCurrentTrack(trackList[nextIndex]);
        setLastTrack(current);
      }
    }
    if (currentTrack() && currentTrack().now) {
      sleepTime = sleepTime * 2;
    }
    await sleep(sleepTime);
    animateTracks();
  };

  onMount(async () => {
    updateTracksTimer = setInterval(
      () => updateTracks(),
      updateTracksIntervalMs,
    );
    await updateTracks();
    animateTracks();
  });

  onCleanup(() => {
    clearTimeout(sleepTimer);
    clearInterval(updateTracksTimer);
  });

  return (
    <div class={styles.Video}>
      <div class={styles.Title}>Stereo Bar TV</div>
      <GamepadConnectionInfo/>
      <div class={styles.Slider}>
        <div ref={currentTrackEl}>
          <TrackInfo data={currentTrack()} />
        </div>
        <div ref={lastTrackEl}>
          <TrackInfo data={lastTrack()} />
        </div>
      </div>
      <VideoBackground />
    </div>
  );
};

export default Video;
