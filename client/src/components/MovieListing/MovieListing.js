import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMovies, getAllShows, getLoader, fetchAsyncMovies, fetchAsyncShows } from "../../features/movies/movieSlice";
import MovieCard from "../MovieCard/MovieCard";
import "./MovieListing.scss";
import Slider from "react-slick";
import { settings } from "../../common/settings";
import { PropagateLoader } from "react-spinners";
import { useParams } from "react-router-dom";

const MovieListing = () => {
  const movies = useSelector(getAllMovies);
  const shows = useSelector(getAllShows);
  const loader = useSelector(getLoader);
  let renderMovies = "";
  let renderShows = "";
  const {term} = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (term) {
      dispatch(fetchAsyncMovies(term));
      dispatch(fetchAsyncShows(term));
    }
  },[term, dispatch])

  console.log("movies: ",movies);

  renderMovies =
    movies.Response === "True" ? (
      movies.Search.map((movie, index) => {
        return <MovieCard key={index} data={movie} />;
      })
    ) : "";
  renderShows =
    shows.Response === "True" ? (
      shows.Search.map((show, index) => {
        return <MovieCard key={index} data={show} />;
      })
    ) : "";
  return (
    <div className="movie-wrapper">
      {!loader ? (
        <div>
        <div className="movie-list">
        <h2>Movies</h2>
        <div className="movie-container"> 
           <Slider {...settings}>{renderMovies}</Slider>
        </div>
      </div>
      <div className="show-list">
        <h2>Shows</h2>
        <div className="movie-container">
          <Slider {...settings}>{renderShows}</Slider>
        </div>
      </div>
        </div>
      ) : <PropagateLoader className="loader" color="white"/>}
    </div>
  );
};

export default MovieListing;
