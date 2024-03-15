import React, { useEffect, useState } from "react";
import axios from "axios";
import { APIKey } from "../../common/apis/movieApiKey";
import "./ShowEpisode.scss";

function ShowEpisodes(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchEpisode = async () => {
      const response = await axios.get(
        `https://www.omdbapi.com/?apiKey=${APIKey}&i=${props.imdbID}&Season=${props.season}`
      );
      // console.log(response.json());
      const episodes = response.data.Episodes;
      setData(episodes);
    };
    fetchEpisode();
  }, [props.imdbID, props.season]);

  return (
    data.map((episode, index) => (
      <div key={index} className="episodes-wrapper">
        <div className="left-side">
          <div className="thumbnail">
            <img src={props.poster} alt="" />
          </div>
        </div>
        <div className="right-side">
            <div><span>S{ props.season}.E{episode.Episode}:</span> {episode.Title}</div>
            <div className="release-date">
              <span>Release Date: </span>{episode.Released}
            </div>
            <p><span className="rating">IMDB Rating: </span>{episode.imdbRating}/10</p>
        </div>
      </div>
    ))
  );
}

export default ShowEpisodes;
