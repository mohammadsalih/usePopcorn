import { useEffect, useState } from "react";

export function useLocalStorage(initialState, localName) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(localName);

    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(localName, JSON.stringify(value));
    },
    [value, localName]
  );

  return [value, setValue];
}
