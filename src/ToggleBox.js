import React, { useState } from "react";

export default function ToggleBox({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      >
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}
