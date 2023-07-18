import React, { useRef, useEffect } from "react";

export default function SearchBar({ searchQuery, onSetSearchQuery }) {
  const inputEl = useRef(null);

  useEffect(() => {
    function callBack(e) {
      if (
        e.code !== "Enter" ||
        document.activeElement === inputEl.current
      )
        return;
      onSetSearchQuery("");
      inputEl.current.focus();
    }

    document.addEventListener("keydown", callBack);

    return () => {
      document.removeEventListener("keydown", callBack);
    };
  }, [onSetSearchQuery]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      ref={inputEl}
      value={searchQuery}
      onChange={(e) => {
        onSetSearchQuery(e.target.value);
      }}
    />
  );
}
