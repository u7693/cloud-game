import { useState } from 'react';
/*
import { Event } from '../types/Event';

type key = 'a' | 'b' | 'x' | 'y' | 'l' | 'r' | 'start' | 'select' | 'up' | 'down' | 'left' | 'right' | 'l2' | 'r2' | 'l3' | 'r3';

const useController = () => {
  const [pollIntervalMs, setPollIntervalMs] = useState(10);
  const [pollIntervalId, setPollIntervalId] = useState<NodeJS.Timer | null>(null);
  const [controllerChangedIndex, setControllerChangedIndex] = useState(-1);

  const [controller, setController] = useState({
    a: false,
    b: false,
    x: false,
    y: false,
    l: false,
    r: false,
    start: false,
    select: false,
    up: false,
    down: false,
    left: false,
    right: false,
    l2: false,
    r2: false,
    l3: false,
    r3: false,
  });

  const [controllerEncoded, setControllerEncoded] = useState(new Array(16).fill(0));

  const keys: key[] = [
    'a',
    'b',
    'x',
    'y',
    'l',
    'r',
    'start',
    'select',
    'up',
    'down',
    'left',
    'right',
    'l2',
    'r2',
    'l3',
    'r3',
  ];

  const poll = () => {
    return {
      setPollInterval: (ms: number) => setPollIntervalMs(ms),
      enable: () => {
        if (pollIntervalId) return;

        console.info(`[input] poll set to ${pollIntervalMs}ms`);
        setPollIntervalId(setInterval(sendControllerState, pollIntervalMs));
      },
      disable: () => {
        if (!pollIntervalId) return;

        console.info('[input] poll has been disabled');
        clearInterval(pollIntervalId);
        setPollIntervalId(null);
      }
    }
  };

  const sendControllerState = () => {
    if (controllerChangedIndex >= 0) {
      // publish(Event.CONTROLLER_UPDATED, encodeState());
      setControllerChangedIndex(-1);
    }
  };

  const setKeyState = (name: key, state) => {
    setController(state);
    setControllerChangedIndex(Math.max(controllerChangedIndex, 0));
  };

  const setAxisChanged = (index, value) => {
    if (controllerEncoded[index + 1] !== undefined) {
      controllerEncoded[index + 1] = Math.floor(32767 * value);
      // controllerChangedIndex = Math.max(controllerChangedIndex, index + 1);
    }
  };

  const encodeState = () => {
    controllerEncoded[0] = 0;
    return new Uint16Array(controllerEncoded.slice(0, controllerChangedIndex + 1));
  }

  return {
    poll,
    setKeyState,
    setAxisChanged,
  }
}
*/

export const useController = () => {
  const [controller, setController] = useState(1);
  return controller
}