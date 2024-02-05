import type { Component } from 'solid-js';

import styles from './VideoBackground.module.css';

const youtubePlaylistID = 'PLAYHOPLOMODr7T-fXc57dyrDwpx8XI9KI';
const youtubeURL =
  'https://www.youtube.com/embed/videoseries?list=' +
  youtubePlaylistID +
  '&mute=1&wmode=opaque&modestbranding=1&autoplay=1&loop=1&controls=0&rel=0" ' +
  ' title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; ' +
  'clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

const VideoBackground: Component = () => {
  return (
    <iframe
      src={false ? 'http://www.example.org' : youtubeURL}
      allowfullscreen
      class={styles.VideoBackground}
    ></iframe>
  );
};

export default VideoBackground;
