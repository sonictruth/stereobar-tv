import { Component, onCleanup, onMount } from 'solid-js';
import './custom.css';
// @ts-ignore
import NESCntlr from 'nes-cntlr';

type props = {
  onNesKey: Function;
};
const globalNesPropertyName = '_nesctrl';

let eventsArr = [
  'up-left',
  'up-right',
  'down-left',
  'down-right',
  'up',
  'right',
  'left',
  'down',
  'b',
  'a',
  'select',
  'start',
];


const GamepadButtons: Component<props> = (props) => {
  let gamepadEl: HTMLDivElement | null;

  const onKeyPress = (keyEvent: any) => {
    props.onNesKey(keyEvent);
    if (keyEvent.detail.pressed && navigator.vibrate) {
      navigator.vibrate(80);
    }
  };

  onMount(() => {
    // @ts-ignore
    if (!window[globalNesPropertyName]) {
      // @ts-ignore
      window[globalNesPropertyName] = new NESCntlr({
        virtual: 'always',
      });
      // @ts-ignore
      window[globalNesPropertyName].init();
    }
    eventsArr.forEach((event) => {
      document.addEventListener(`player1:${event}`, onKeyPress);
    });
    gamepadEl = document.querySelector('.cntlr');
    if (gamepadEl) {
      gamepadEl.style.visibility = '';
    }
  });
  onCleanup(() => {
    eventsArr.forEach((event) => {
      document.removeEventListener(`player1:${event}`, onKeyPress);
    });
    console.log(gamepadEl);
    if (gamepadEl) {
      gamepadEl.style.visibility = 'hidden';
    }
  });
  return <></>;
};

export default GamepadButtons;
