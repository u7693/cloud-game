export enum Event {
  LATENCY_CHECK_REQUESTED = 'latencyCheckRequested',
  PING_REQUEST = 'pingRequest',
  PING_RESPONSE = 'pingResponse',

  GET_SERVER_LIST = 'getServerList',

  GAME_ROOM_AVAILABLE = 'gameRoomAvailable',
  GAME_SAVED = 'gameSaved',
  GAME_LOADED = 'gameLoaded',
  // used to transfer the index value between touch and controller
  GAME_PLAYER_IDX_CHANGE = 'gamePlayerIndexChange',
  GAME_PLAYER_IDX = 'gamePlayerIndex',

  CONNECTION_READY = 'connectionReady',
  CONNECTION_CLOSED = 'connectionClosed',

  MEDIA_STREAM_SDP_AVAILABLE = 'mediaStreamSdpAvailable',
  MEDIA_STREAM_CANDIDATE_ADD = 'mediaStreamCandidateAdd',
  MEDIA_STREAM_CANDIDATE_FLUSH = 'mediaStreamCandidateFlush',
  MEDIA_STREAM_READY = 'mediaStreamReady',

  GAMEPAD_CONNECTED = 'gamepadConnected',
  GAMEPAD_DISCONNECTED = 'gamepadDisconnected',

  MENU_HANDLER_ATTACHED = 'menuHandlerAttached',
  MENU_PRESSED = 'menuPressed',
  MENU_RELEASED = 'menuReleased',

  KEY_PRESSED = 'keyPressed',
  KEY_RELEASED = 'keyReleased',
  KEY_STATE_UPDATED = 'keyStateUpdated',
  KEYBOARD_TOGGLE_FILTER_MODE = 'keyboardToggleFilterMode',
  KEYBOARD_KEY_PRESSED = 'keyboardKeyPressed',
  AXIS_CHANGED = 'axisChanged',
  CONTROLLER_UPDATED = 'controllerUpdated',

  DPAD_TOGGLE = 'dpadToggle',
  STATS_TOGGLE = 'statsToggle',
  HELP_OVERLAY_TOGGLED = 'helpOverlayToggled',

  SETTINGS_CHANGED = 'settingsChanged',
  SETTINGS_CLOSED = 'settingsClosed',

  RECORDING_TOGGLED = 'recordingToggle',
  RECORDING_STATUS_CHANGED = 'recordingStatusChanged',
}