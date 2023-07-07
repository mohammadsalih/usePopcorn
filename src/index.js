import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from "./App";
import Rating from "./Rating.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <Rating maxRating={10} />
    <Rating maxRating={5} />
  </React.StrictMode>
);
