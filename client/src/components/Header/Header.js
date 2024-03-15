import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import userImg from "../../images/userImg.png";
import "./Header.scss";
import { useDispatch } from "react-redux";
import {
  fetchAsyncMovies,
  fetchAsyncShows,
} from "../../features/movies/movieSlice";
import axios from "axios";
import useLogout from "../../utils/useLogout";

const Header = ({currUser}) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const res = await axios.get("http://localhost:5000/api/users/getUser", {
        headers,
      });

      setUser(res.data.data.user);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching current user:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken && Object.keys(user).length !== 0) {
      fetchCurrentUser();
    }
  }, []);

  console.log("current user: ", user);
  // console.log("refreshToken: ",localStorage.getItem("refreshToken"))

  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchTerm === "") return alert("Please enter search searchTerm!");
    dispatch(fetchAsyncMovies(searchTerm));
    dispatch(fetchAsyncShows(searchTerm));
    navigate(`/${searchTerm}`);
    setSearchTerm("");
  };

  const { logout } = useLogout();

  const handleLogout = async () => {
    await logout();
    setUser({});
    // navigate("/")
  };

  return (
    <div className="header">
      <div className="logo">
        <Link to="/">
          MovieMania<i class="fa-solid fa-clapperboard"></i>
        </Link>
      </div>
      <div className="search-bar">
        <form onSubmit={submitHandler} action="">
          <input
            type="text"
            value={searchTerm}
            placeholder="Search for Movies or Shows"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <i className="fa fa-search"></i>
          </button>
        </form>
      </div>
      <div className="links">
        {user && Object.keys(user).length > 0 ? (
          <div>
            <Link className="link" to="/watchlist">
              My WatchList
            </Link>
            <Link className="link" onClick={handleLogout} disabled={loading}>
              Logout
            </Link>
          </div>
        ) : (
          <div>
            <Link className="link" to="/register">
              Register
            </Link>
            <Link className="link" to="/login">
              LogIn
            </Link>
          </div>
        )}
      </div>
      <div className="user-image">
        <img src={!user ?  userImg : user.avatar } alt="user" />
      </div>
    </div>
  );
};

export default Header;
