import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import MovieDetail from "./components/MovieDetail/MovieDetail";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import MovieListing from "./components/MovieListing/MovieListing";
import "./App.scss"
import Watchlist from "./pages/watchlist/Watchlist";

function App() {
  const [user, setUser] = useState({});

  const updateUser = (userData) => {
    setUser(userData);
  };

  console.log("app user", user)

  return (
    <div className="App">
      <Header currUser={user} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:term" element={<MovieListing />} />
          <Route path="/movie/:imdbID" element={<MovieDetail />} />
          {/* Pass updateUser function to Login component */}
          <Route path="/login" element={<Login updateUser={updateUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route element={<PageNotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
