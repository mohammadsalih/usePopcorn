import { useEffect, useState } from "react";
import { API_KEY } from "../helpers/helpers";

export function useMovies(searchQuery) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setError("");
        setIsLoading(true);

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error(
            "Something went wrong with fetching movies"
          );

        const data = await res.json();

        if (data.Response === "False")
          throw new Error("Movies not found");

        setMovies(data.Search);
      } catch (err) {
        console.error(err.message);
        if (err.name === "AbortError") return;
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (searchQuery.length < 3) {
      setMovies([]);
      setError("");
      setIsLoading(false);
      return;
    }

    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [searchQuery]);

  return { movies, isLoading, error };
}
