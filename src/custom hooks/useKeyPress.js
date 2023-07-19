import { useEffect } from "react";

export function useKeyPress(key, func) {
  useEffect(
    function () {
      function callBack(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          func();
        }
      }

      document.addEventListener("keydown", callBack);

      return () => {
        document.removeEventListener("keydown", callBack);
      };
    },
    [func, key]
  );
}
