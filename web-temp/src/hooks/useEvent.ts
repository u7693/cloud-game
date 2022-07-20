import { useState } from 'react';
import { Event } from "../types/Event";

type Data = {
}

type Listener = (data: Data) => void;

type TopicsInner = {
  [index: number]: Listener;
}

const useEvent = () => {
  const [index, setIndex] = useState(0);

  type Topics = Record<Event, TopicsInner>;

  const [topics, setTopics] = useState<Topics>({
    [Event.LATENCY_CHECK_REQUESTED]: {},
    [Event.PING_REQUEST]: {},
    [Event.PING_RESPONSE]: {},
    [Event.GET_SERVER_LIST]: {},
    [Event.GAME_ROOM_AVAILABLE]: {},
    [Event.GAME_SAVED]: {},
    [Event.GAME_LOADED]: {},
    [Event.GAME_PLAYER_IDX_CHANGE]: {},
    [Event.GAME_PLAYER_IDX]: {},
    [Event.CONNECTION_READY]: {},
    [Event.CONNECTION_CLOSED]: {},
    [Event.MEDIA_STREAM_SDP_AVAILABLE]: {},
    [Event.MEDIA_STREAM_CANDIDATE_ADD]: {},
    [Event.MEDIA_STREAM_CANDIDATE_FLUSH]: {},
    [Event.MEDIA_STREAM_READY]: {},
    [Event.GAMEPAD_CONNECTED]: {},
    [Event.GAMEPAD_DISCONNECTED]: {},
    [Event.MENU_HANDLER_ATTACHED]: {},
    [Event.MENU_PRESSED]: {},
    [Event.MENU_RELEASED]: {},
    [Event.KEY_PRESSED]: {},
    [Event.KEY_RELEASED]: {},
    [Event.KEY_STATE_UPDATED]: {},
    [Event.KEYBOARD_TOGGLE_FILTER_MODE]: {},
    [Event.KEYBOARD_KEY_PRESSED]: {},
    [Event.AXIS_CHANGED]: {},
    [Event.CONTROLLER_UPDATED]: {},
    [Event.DPAD_TOGGLE]: {},
    [Event.STATS_TOGGLE]: {},
    [Event.HELP_OVERLAY_TOGGLED]: {},
    [Event.SETTINGS_CHANGED]: {},
    [Event.SETTINGS_CLOSED]: {},
    [Event.RECORDING_TOGGLED]: {},
    [Event.RECORDING_STATUS_CHANGED]: {},
  });

  const setSubscribe = (topic: Event, listener: Listener, order = 0) => {
    setIndex(i => i + 1);
    const newTopics = {
      ...topics,
      [topic]: {
        ...topics[topic],
        [order * 1000000 + index]: listener,
      }
    };
    setTopics(newTopics);

    // TODO: バグるかも？
    return () => {
      delete topics[topic][order * 1000000 + index];
      setTopics(topics);
    }
  }

  const publish = (topic: Event, data: Data) => {
    for (let listenerIndex in topics[topic]) {
      topics[topic][listenerIndex](data);
    };
  }

  return {
    setSubscribe,
    publish,
  }
}