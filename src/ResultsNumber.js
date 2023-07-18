import React from "react";

export default function ResultsNumber({ numberOfResults }) {
  return (
    <p className="num-results">
      Found <strong>{numberOfResults}</strong> results
    </p>
  );
}
