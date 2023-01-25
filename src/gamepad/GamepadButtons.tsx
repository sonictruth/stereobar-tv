import { Component, onCleanup, onMount } from 'solid-js';
import './GamepadButtons.css';

type props = {
  onNesKey: Function;
};

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
  let buttonsPadRef: HTMLDivElement | undefined;
  const handleTouch = (event: TouchEvent) => {
    const target = event.target as HTMLElement;
    const button = target.closest('button') as HTMLElement;
    if (button && button.dataset.btn) {
      const keyEvent = {
        pressed: event.type === 'touchstart' ? true : false,
        btn: button.dataset.btn,
      };
      console.log(keyEvent);
      props.onNesKey(keyEvent);
      if (keyEvent.pressed && navigator.vibrate) {
        navigator.vibrate(80);
      }
    }
    event.preventDefault();
  };

  onMount(() => {
    buttonsPadRef?.addEventListener('touchstart', handleTouch, {
      passive: false,
    });
    buttonsPadRef?.addEventListener('touchend', handleTouch, {
      passive: false,
    });
  });

  onCleanup(() => {
    buttonsPadRef?.removeEventListener('touchstart', handleTouch);
    buttonsPadRef?.removeEventListener('touchend', handleTouch);
  });

  return (
    <div ref={buttonsPadRef} class="gp">
      <table class="dpad">
        <tbody>
          <tr>
            <td></td>
            <td>
              <button data-btn="up" class="button-axes axes-U">
                <i class="arrow arrow-up"></i>
              </button>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <button data-btn="left" class="button-axes axes-L">
                <i class="arrow arrow-left"></i>
              </button>
            </td>
            <td>
              <button data-btn="down" class="button-axes axes-D">
                <i class="arrow arrow-down"></i>
              </button>
            </td>
            <td>
              <button data-btn="right" class="button-axes axes-R">
                <i class="arrow arrow-right"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="buttons2">
        <button data-btn="select" class="button-bar-mini button-SELECT">
          SELECT
        </button>
        <button data-btn="start" class="button-bar-mini button-SELECT">
          START
        </button>
      </div>
      <div class="buttons1">
        <button data-btn="b" class="button-circle button-B">
          B
        </button>
        <button data-btn="a" class="button-circle button-A">
          A
        </button>
      </div>

    </div>
  );
};

export default GamepadButtons;
