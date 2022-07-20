import { useState } from "react";

// TODO: react-locationなどを使って書き換える
export const useZone = () => {
  const [zone, setZone] = useState<string | null>(null);

  // 最初のパスを取得
  const executed = /^\/?([A-Za-z]*)\/?/g.exec(window.location.pathname)

  if (executed) {
    setZone(executed[1])
  }

  return zone
}
