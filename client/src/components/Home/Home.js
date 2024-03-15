import React, { useEffect } from "react";
import MovieListing from "../MovieListing/MovieListing";
import { useDispatch } from "react-redux";
import {
  fetchAsyncMovies,
  fetchAsyncShows,
} from "../../features/movies/movieSlice";

const HomeComponent = () => {
  return (
    <div>
      <h1></h1>
    </div>
  )
}

const Home = () => {
  // dispatch uses reducer to put values in store
  const dispatch = useDispatch();
  const movieText = "";
  const showText = "";
  useEffect(() => {
    dispatch(fetchAsyncMovies(movieText));
    dispatch(fetchAsyncShows(showText));
  }, [dispatch]);

  return (
    <div>
      <div className="banner-img"></div>
      {movieText || showText ? <MovieListing /> : <HomeComponent/>}
    </div>
  );
};

export default Home;
