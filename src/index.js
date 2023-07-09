import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from "./App";
import Rating from "./Rating.js";

function Test() {
  const [movieRating, setMovieRating] = useState(0);

  return (
    <div>
      <Rating maxRating={10} size="48" onSetRating={setMovieRating} />

      <p>this moview was rated {movieRating} out of 10</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <Rating
      maxRating={10}
      color="#fcc419"
      size="48"
      defualtRating={8}
    />

    <Test />
  </React.StrictMode>
);
