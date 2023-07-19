import React, { useRef } from "react";
import { useKeyPress } from "../custom hooks/useKeyPress";

export default function SearchBar({ searchQuery, onSetSearchQuery }) {
  const inputEl = useRef(null);

  function handleKeyPress() {
    if (document.activeElement !== inputEl.current) {
      onSetSearchQuery("");
      inputEl.current.focus();
    }
  }

  useKeyPress("Enter", handleKeyPress);

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
