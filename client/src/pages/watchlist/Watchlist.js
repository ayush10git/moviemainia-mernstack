import "./Watchlist.scss";
import { APIKey } from "../../common/apis/movieApiKey";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Watchlist() {
  const accessToken = localStorage.getItem("accessToken");
  const [watchlist, setWatchlist] = useState([]);
  
  useEffect(() => {
    const fetchWatchlistMovies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/getUser", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const currentUserWatchlist = res.data.data.user.watchlist;

        const movieDataPromises = currentUserWatchlist.map(async (imdbID) => {
          const movieRes = await axios.get(
            `http://www.omdbapi.com/?apikey=${APIKey}&i=${imdbID}`
          );
          return {imdbID, ...movieRes.data};
        });

        const movieData = await Promise.all(movieDataPromises);
        setWatchlist(movieData);

      } catch (error) {
        console.log(error);
      }
    };

    fetchWatchlistMovies(); 
  }, [accessToken]); 
  
  const handleRemoveFromWatchlist = async (imdbID) => {
  try {
    if (imdbID) {
      // Send a POST request to the server to remove the movie from the watchlist
      await axios.post(
        "http://localhost:5000/api/users/removeFromWatchlist",
        { imdbID },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update the watchlist state to remove the movie with the specified IMDb ID
      setWatchlist((prevWatchlist) =>
        prevWatchlist.filter((movie) => movie.imdbID !== imdbID)
      );
      
      console.log(imdbID + " removed from watchlist");
    } else {
      console.error("Invalid imdbID:", imdbID);
    }
  } catch (error) {
    console.error("Error removing from watchlist:", error);
  }
};


  useEffect(() => {
    handleRemoveFromWatchlist();
  },[handleRemoveFromWatchlist])

  console.log("watchlist: ", watchlist);

  return (
    <div className="watchlist">
      {watchlist.map(
        (movie) =>
          (movie.Type = movie && (
            <div className="watchlist-item">
              <Link to={`/movie/${movie.imdbID}`}>
                <div className="watchlist-inner">
                  <div className="watchlist-top">
                    <img src={movie.Poster} alt={movie.Title} />
                  </div>
                  <div className="watchlist-bottom">
                    <div className="watchlist-info">
                      <h4>{movie.Title} </h4>
                      <p>{movie.Year} </p>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="overlay"></div>
              <button className="add-to-watchlist" onClick={()=> handleRemoveFromWatchlist(movie.imdbID)}>Remove</button>
            </div>
          ))
      )}
    </div>
  );
}

export default Watchlist;
