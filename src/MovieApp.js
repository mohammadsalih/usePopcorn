import { useState } from "react";
import { useMovies } from "./custom hooks/useMovies";
import NavigationBar from "./components/NavigationBar";
import SearchBar from "./components/SearchBar";
import ResultsNumber from "./components/ResultsNumber";
import Main from "./components/Main";
import ToggleBox from "./components/ToggleBox";
import MoviesList from "./components/MoviesList";
import MovieDetails from "./components/MovieDetails";
import WatchedSummary from "./components/WatchedSummary";
import WatchedMoviesList from "./components/WatchedMoviesList";
import ErrorMessage from "./components/ErrorMessage";
import Loader from "./components/Loader";
import { useLocalStorage } from "./custom hooks/useLocalStorage";

export default function MovieApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const { movies, isLoading, error } = useMovies(searchQuery);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [watchedMovies, setWatchedMovies] = useLocalStorage(
    [],
    "watchedMovies"
  );

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
