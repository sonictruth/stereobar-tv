import type { Component } from 'solid-js';
import styles from './VideoTicker.module.css';

type VideoTickerProps = {
  currentlyPlaying: any;
};

const VideoTicker: Component<VideoTickerProps> = (props) => {
  console.log(props);
  return (
    <>
      {props.currentlyPlaying !== null && (
        <div class={styles.VideoTicker}>
          <div class={styles.VideoTickerLogo}>
            <img src={props.currentlyPlaying.item.album.images[1].url} />
          </div>
          <div class={styles.VideoTickerMarquee}>
            <div class={styles.VideoTickerMarqueeArtist}>
              {props.currentlyPlaying.item.album.artists
                .map((artist: any) => artist.name)
                .join(', ')}
            </div>
            <div class={styles.VideoTickerMarqueeTrack}>
              {props.currentlyPlaying.item.name}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoTicker;
