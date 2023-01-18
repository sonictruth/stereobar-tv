import { Component, For } from 'solid-js';
import { createSignal, onCleanup, onMount } from 'solid-js';
import styles from './Video.module.css';
import animations from './animations';

import VideoBackground from './VideoBackground';
import TrackInfo from './TrackInfo';

import peerServer from '../peerServer';
import GameInfo from './GameInfo';

const animateTracksIntervalMs = 3000;
const updateTracksIntervalMs = 25000;

const lastFMApiURL = 'http://www.sonicpix.ro/lastfm.php';

const sleep = async (ms: number): Promise<any> => {
  return new Promise((resolve) => {
    let id: any;
    id = setTimeout(() => resolve(id), ms);
  });
};

const Video: Component = () => {
  let animateTracksTimer: any, updateTracksTimer: any;
  let lastTrackEl: HTMLDivElement |undefined ;
  let currentTrackEl: HTMLDivElement |undefined ;
  const [error, setError] = createSignal<any>(null);
  const [tracks, setTracks] = createSignal<any[]>([]);
  const [currentTrack, setCurrentTrack] = createSignal<any>(null);
  const [lastTrack, setLastTrack] = createSignal<any>(null);
  const [gamepadURL, setGamepadURL] = createSignal('http://www.google.com/');

  const updateTracks = async () => {
    const response = await fetch(lastFMApiURL);
    const newTracks = await response.json();
    setTracks(newTracks);
  };

  const animateTracks = async () => {
    if(lastTrackEl) {
      lastTrackEl.style.display = 'none';
    }
    if(currentTrackEl) {
      currentTrackEl.style.display = 'block';
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
  };

  onMount(async () => {
    animateTracksTimer = setInterval(
      () => animateTracks(),
      animateTracksIntervalMs,
    );
    updateTracksTimer = setInterval(
      () => updateTracks(),
      updateTracksIntervalMs,
    );
    await updateTracks();
    animateTracks();
  });

  onCleanup(() => {
    clearInterval(animateTracksTimer);
    clearInterval(updateTracksTimer);
  });

  return (
    <div class={styles.Video}>
      <div class={styles.Title}>Stereo Bar TV</div>
      <GameInfo url={gamepadURL()} />
      <div ref={currentTrackEl}>
        <TrackInfo data={currentTrack()} />
      </div>
      <div ref={lastTrackEl}>
        <TrackInfo data={lastTrack()} />
      </div>

      <VideoBackground />
    </div>
  );
};

export default Video;
