import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RiseLoader } from "react-spinners";
import {
  fetchAsyncMovieOrShowDetail,
  getSelectedMovieOrShow,
  removeSelectedMovieOrShow,
} from "../../features/movies/movieSlice";
import "./MovieDetail.scss";
import ShowEpisodes from "../ShowEpisodes/ShowEpisodes";

const MovieDetail = () => {
  const { imdbID } = useParams();
  const dispatch = useDispatch();
  const data = useSelector(getSelectedMovieOrShow);
  useEffect(() => {
    dispatch(fetchAsyncMovieOrShowDetail(imdbID));
    return () => {
      dispatch(removeSelectedMovieOrShow());
    };
  }, [dispatch, imdbID]);

  const [selectedButton, setSelectedButton] = useState(1);

  function Buttons() {
    const handleButtonClick = (value) => {
      setSelectedButton(value);
    };

    const buttons = [];

    for (let i = 1; i <= data.totalSeasons; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handleButtonClick(i)}
        >
          {i}
        </button>
      );
    }

    return <div>{buttons}</div>;
  }

  return (
    <div>
      <div className="movie-section">
        {Object.keys(data).length === 0 ? (
          <div>
            <RiseLoader color="white" />
          </div>
        ) : (
          <>
            <div className="section-left">
              <div className="movie-title">{data.Title}</div>
              <div className="movie-rating">
                <span>
                  IMDB Rating <i className="fa fa-star"></i>: {data.imdbRating}
                </span>
                <span>
                  IMDB Votes <i className="fa fa-thumbs-up"></i>: {data.Votes}
                </span>
                <span>
                  Runtime <i className="fa fa-film"></i>: {data.Runtime}
                </span>
                <span>
                  Year <i className="fa fa-calendar"></i>: {data.Year}
                </span>
              </div>
              <div className="movie-plot">{data.Plot} </div>
              <div className="movie-info">
                <div>
                  <span>Director</span>
                  <span>{data.Director}</span>
                </div>
                <div>
                  <span>Stars</span>
                  <span>{data.Actors}</span>
                </div>
                <div>
                  <span>Genre</span>
                  <span>{data.Genre}</span>
                </div>
                <div>
                  <span>Languages</span>
                  <span>{data.Language}</span>
                </div>
                <div>
                  <span>Awards</span>
                  <span>{data.Awards}</span>
                </div>
                {data.Type === "series" ? (
                  <div>
                    <div>
                      <span>Seasons</span>
                      <span>{data.totalSeasons}</span>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="section-right">
              <img src={data.Poster} alt={data.Title} />
            </div>
          </>
        )}
      </div>
      {data.Type === "series" ? (
        <>
          <div className="season-buttons">
            <Buttons />
          </div>
          <div className="episode">
            <ShowEpisodes imdbID={data.imdbID} poster={data.Poster} season={selectedButton} />
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default MovieDetail;
