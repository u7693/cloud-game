import { useState } from "react";

export const useObject = <T extends Record<string, object>>(initialObject: T) => {
  const [object, setObject] = useState(initialObject);

  const setValue = (key: keyof T, value: T[keyof T]) => {
    setObject({ ...object, [key]: value });
  }

  return {
    object,
    setObject,
    setValue,
  };
}

