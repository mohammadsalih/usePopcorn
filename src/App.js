import React, { useEffect, useMemo, useRef, useState } from "react";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import StarRating from "./Rating.js";

const API_KEY = "5310ad9c";

const calculateAverage = (arr) =>
  arr.reduce((acc, cur) => acc + cur / arr.length, 0);

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

function NavigationBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBar({ searchQuery, onSetSearchQuery }) {
  const inputEl = useRef(null);

  useEffect(
    function () {
      function callBack(e) {
        if (
          e.code !== "Enter" ||
          document.activeElement === inputEl.current
        )
          return;
        onSetSearchQuery("");
        inputEl.current.focus();
      }

      document.addEventListener("keydown", callBack);

      return () => {
        document.removeEventListener("keydown", callBack);
      };
    },
    [onSetSearchQuery]
  );

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

function ResultsNumber({ numberOfResults }) {
  return (
    <p className="num-results">
      Found <strong>{numberOfResults}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function ToggleBox({ children }) {
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

function MoviesList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({
  selectedMovieId,
  onCloseMovie,
  onAddWatchedMovie,
  watchedMovies,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const watchedMovie = useMemo(
    () =>
      watchedMovies.find((movie) => movie.imdbID === selectedMovieId),
    [watchedMovies, selectedMovieId]
  );

  const {
    Title: title,
    Year: year,
    Poster: poster,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    Runtime: runtime,
  } = movie;

  function handleAddWatched() {
    const newWatchedMovie = {
      imdbID: selectedMovieId,
      title,
      year,
      poster,
      userRating,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
    };
    onAddWatchedMovie(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(() => {
    function callBack(e) {
      if (e.code === "Escape") {
        onCloseMovie();
      }
    }

    document.addEventListener("keydown", callBack);

    return () => {
      document.removeEventListener("keydown", callBack);
    };
  }, [onCloseMovie]);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setIsLoading(true);

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedMovieId}`
        );

        if (!res.ok)
          throw new Error(
            "Something went wrong with fetching movies"
          );

        const data = await res.json();

        if (data.Response === "False")
          throw new Error("Movies not found");

        setMovie(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (selectedMovieId.length < 4) return;

    fetchMovie();
  }, [selectedMovieId]);

  useEffect(() => {
    if (!title) return;

    document.title = `Movie : ${title}`;

    return () => {
      document.title = `usePopcorn`;
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader message={"Movie data is loading..."} />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              <IonIcon icon={arrowBackOutline} />
            </button>

            <img src={poster} alt={`Poster of ${title}`} />

            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>⭐️ {imdbRating} IMDB Rating</p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!watchedMovie ? (
                <>
                  <StarRating
                    maxRating={10}
                    color="#fcc419"
                    size={26}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button
                      className="btn-add"
                      onClick={handleAddWatched}
                    >
                      Add To List
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie {watchedMovie.userRating}{" "}
                  <span>⭐️</span>
                </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring actors: {actors}</p>
            <p>Directed by: {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watchedMovies }) {
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

function WatchedMoviesList({ watchedMovies, onDeleteWatchedMovie }) {
  return (
    <ul className="list">
      {watchedMovies.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatchedMovie={onDeleteWatchedMovie}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatchedMovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatchedMovie(movie.imdbID)}
        >
          x
        </button>
      </div>
    </li>
  );
}

function Loader({ message }) {
  return <p className="loader">{message}</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔️</span> {message}
    </p>
  );
}
