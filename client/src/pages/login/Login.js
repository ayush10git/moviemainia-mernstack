import React, { useEffect, useRef, useState } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useTokenRefresh from "../../utils/useTokenRefresh";

function Login({ updateUser }) {
  const email = useRef();
  const password = useRef();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userCredential = {
      email: email.current.value,
      password: password.current.value,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        userCredential
      );
      const { accessToken, refreshToken } = response.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Fetch user details after successful login
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const res = await axios.get("http://localhost:5000/api/users/getUser", {
        headers,
      });

      // Update user state in parent component
      updateUser(res.data.data.user);
      navigate("/")
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  useTokenRefresh();

  return (
    <div>
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <h3 className="loginLogo">MovieMania</h3>
            <span className="loginDesc">
              Make a list of your watched and unwatched movies and series
            </span>
          </div>
          <div className="loginRight">
            <form className="loginBox" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username or Email"
                ref={email}
                required
                className="loginInput"
              />
              <input
                type="password"
                placeholder="Password"
                required
                className="loginInput"
                minLength={6}
                ref={password}
              />
              <button className="loginButton" type="submit">
                {loading ? "Logging in..." : "Log In"}
              </button>
              <Link to="/register">
                <span>Not signed up yet? Sign Up</span>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
