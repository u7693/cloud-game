import { useState } from "react";

export const useRoom = (initialRoomId: string) => {
  const [roomId, setRoomId] = useState(initialRoomId);
  const [zone, setZone] = useState<string | null>(null);
  const [room, setRoom] = useState<string | null>(null);

  const regex = /^\/?([A-Za-z]*)\/?/g;

  const executed = regex.exec(window.location.pathname)

  if (executed) {
    setZone(executed[1])
  }

  const wid = new URLSearchParams(window.location.search).get('wid')
  const id = new URLSearchParams(window.location.search).get('id')

  setRoom(id)

  return {
    roomId,
    setRoomId,
    room,
    wid,
    zone,
  }
}
