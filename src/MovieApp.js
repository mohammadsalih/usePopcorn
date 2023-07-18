import React, { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar";
import SearchBar from "./SearchBar";
import ResultsNumber from "./ResultsNumber";
import Main from "./Main";
import ToggleBox from "./ToggleBox";
import MoviesList from "./MoviesList";
import MovieDetails from "./MovieDetails";
import WatchedSummary from "./WatchedSummary";
import WatchedMoviesList from "./WatchedMoviesList";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";

import { API_KEY } from "./helpers";

export default function MovieApp() {
  const [movies, setMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState(function () {
    const storedValue = localStorage.getItem("watchedMovies");

    return JSON.parse(storedValue);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  function handleAddWatchedMovie(movie) {
    setWatchedMovies((watchedMovies) => [...watchedMovies, movie]);
  }

  function handleDeleteWatchedMovie(id) {
    setWatchedMovies((watchedMovies) =>
      watchedMovies.filter((movie) => movie.imdbID !== id)
    );
  }

  function handleSelectMovie(selectedMovieId) {
    setSelectedMovieId((prevId) =>
      prevId === selectedMovieId ? null : selectedMovieId
    );
  }

  function handleCloseMovie() {
    setSelectedMovieId(null);
  }

  useEffect(
    function () {
      localStorage.setItem(
        "watchedMovies",
        JSON.stringify(watchedMovies)
      );
    },
    [watchedMovies]
  );

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

  return (
    <>
      <NavigationBar>
        <SearchBar
          onSetSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
        />
        <ResultsNumber numberOfResults={movies ? movies.length : 0} />
      </NavigationBar>

      <Main>
        <ToggleBox>
          {error ? (
            <ErrorMessage message={error} />
          ) : isLoading ? (
            <Loader message={"Movies are loading..."} />
          ) : (
            <MoviesList
              movies={movies}
              onSelectMovie={handleSelectMovie}
            />
          )}
        </ToggleBox>

        <ToggleBox>
          {selectedMovieId ? (
            <MovieDetails
              selectedMovieId={selectedMovieId}
              onCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleAddWatchedMovie}
              watchedMovies={watchedMovies}
            />
          ) : (
            <>
              <WatchedSummary watchedMovies={watchedMovies} />
              <WatchedMoviesList
                watchedMovies={watchedMovies}
                onDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </ToggleBox>
      </Main>
    </>
  );
}
