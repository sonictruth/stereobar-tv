import { Component, Show } from 'solid-js';
import styles from './TrackInfo.module.css';

type props = {
  data: any;
};

const TrackInfo: Component<props> = (props) => {
  return (
    <Show when={props.data !== null}>
      <div class={styles.TrackInfo}>
        <div class={styles.Album}>
          <img src={props.data.img} />
        </div>
        <div class={styles.TextBox}>
          <div class={styles.ArtistName}>{props.data.artist}</div>
          <div class={styles.TrackName}>{props.data.name}</div>
          <div class={styles.TrackTime}>{props.data.time}</div>
        </div>
      </div>
    </Show>
  );
};

export default TrackInfo;
