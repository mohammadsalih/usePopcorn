import React from "react";
import { calculateAverage } from "../helpers/helpers";

export default function WatchedSummary({ watchedMovies }) {
  const avgImdbRating = calculateAverage(
    watchedMovies.map((movie) => movie.imdbRating)
  );
  const avgUserRating = calculateAverage(
    watchedMovies.map((movie) => movie.userRating)
  );
  const avgRuntime = calculateAverage(
    watchedMovies.map((movie) => movie.runtime)
  );

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watchedMovies.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(0)} min</span>
        </p>
      </div>
    </div>
  );
}
