import type { Component } from 'solid-js';
import styles from './TrackInfo.module.css';

type props = {
  url: any;
};

const TrackInfo: Component<props> = (props) => {
  return (
    <div class={styles.GameLink}>
      <a href={props.url}>
        <img
          src={
            'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' +
            encodeURIComponent(props.url)
          }
        />
      </a>
    </div>
  );
};

export default TrackInfo;
