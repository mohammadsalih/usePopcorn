import React, { useState, useEffect, useMemo } from "react";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import StarRating from "./Rating";
import Loader from "./Loader";
import { API_KEY } from "./helpers";

export default function MovieDetails({
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
