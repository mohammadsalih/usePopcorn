import React from "react";
import Logo from "./Logo";

export default function NavigationBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
