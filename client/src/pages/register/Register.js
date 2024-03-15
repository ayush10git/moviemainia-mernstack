import React, { useRef, useState } from "react";
import "./Register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const email = useRef();
  const username = useRef();
  const password = useRef();
  const confirmPassword = useRef();

  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(null);

  const handleClick = async (e) => {
    e.preventDefault();

    if (confirmPassword.current.value !== password.current.value) {
      confirmPassword.current.setCustomValidity("Passwords don't match");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
        confirmPassword: confirmPassword.current.value
      };
      if (avatar) {
        const data = new FormData();
        // const avatarName = Date.now() + avatar.name;
        // data.append("name", avatarName);
        data.append("avatar", avatar);
        user.avatar = avatar;
        try {
          await axios.post("http://localhost:5000/api/users/register", user, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          navigate("/login");
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">MovieMania</h3>
          <span className="registerDesc">
            Make a list of your watched and unwatched movies and series
          </span>
        </div>
        <div className="registerRight">
          <form className="registerBox" onSubmit={handleClick}>
            <label htmlFor="file">
              <input
                type="file"
                id="file"
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </label>
            <input
              type="text"
              placeholder="Username"
              required
              className="registerInput"
              ref={username}
            />
            <input
              type="email"
              placeholder="Email"
              required
              className="registerInput"
              ref={email}
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="registerInput"
              minLength={6}
              ref={password}
            />
            <input
              type="password"
              placeholder="Password Again"
              required
              className="registerInput"
              minLength={6}
              ref={confirmPassword}
            />
            <button className="registerButton" type="submit">
              Sign Up
            </button>
            <span>
              <Link to="/login">Already signed up? Log In</Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
