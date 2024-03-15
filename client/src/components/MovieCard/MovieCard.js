import {useEffect} from "react";
import "./MovieCard.scss";
import { Link } from "react-router-dom";
import axios from "axios";

const MovieCard = (props) => {
  const data = props.data;
  const accessToken = localStorage.getItem("accessToken");

  const handleAddToWatchlist = async (imdbID) => {
    try {
      if (imdbID) {
        await axios.post(
          "http://localhost:5000/api/users/addToWatchlist",
          { imdbID },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(imdbID + " added to watchlist");
      } else {
        console.error("Invalid imdbID:", imdbID);
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  useEffect(() => {
    handleAddToWatchlist();
  },[data.imdbID, handleAddToWatchlist])

  
  return (
    <div className="card-item">
      <Link to={`/movie/${data.imdbID}`}>
        <div className="card-inner">
          <div className="card-top">
            <img src={data.Poster} alt={data.Title} />
          </div>
          <div className="card-bottom">
            <div className="card-info">
              <h4>{data.Title} </h4>
              <p>{data.Year} </p>
            </div>
          </div>
        </div>
      </Link>
      <div className="overlay"></div>
      <button
        className="add-to-watchlist"
        onClick={() => handleAddToWatchlist(data.imdbID)}
      >
        Add to watchlist+
      </button>
    </div>
  );
};

export default MovieCard;
