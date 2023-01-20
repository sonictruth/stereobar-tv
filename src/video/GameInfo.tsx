import { Component, Show } from 'solid-js';
import styles from './GameInfo.module.css';

type props = {
  url: any;
};

const TrackInfo: Component<props> = (props) => {
  return (
    <div class={styles.GameInfo}>
      <Show when={props.url} fallback={(<div>Loading</div>)}>
        <a href={props.url}>
          <img
            src={
              'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' +
              encodeURIComponent(props.url)
            }
          />
        </a>
      </Show>
    </div>
  );
};

export default TrackInfo;
