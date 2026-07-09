import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LogIn.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import store_icon from "../../assets/image.png";

import { CartContext } from "../../components/contextAPI/cartContext.jsx";

import { jwtDecode } from "jwt-decode";

const LogIn = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(CartContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [userData, serUserData] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return;
    }
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/user/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      },
    );
    const result = await response.json();
    // console.log('Result: ',result);
    const { message, success, token } = result;
    // console.log(Name);
    // alert(message);
    if (success) {
      localStorage.setItem("token", token);
      // decode token
      const decodedUser = jwtDecode(token);

      // update context state
      setUser(decodedUser);

      toast.success(message);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      // console.log("wrong", message);
      toast.warning(message);
    }
    // console.log("Email:", email, "Password:", password);
  };

  /* useEffect(() => {
    getUserData();
  }, []); */

  /* const getUserData = async () => {

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/user`,

      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    const result = await response.json();

    if (result.success) {
      toast.success(result.message);
      serUserData(result.user);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      toast.error(result.message);
    }
  }; */

  return (
    <div className="login-container">
      <div className="heading-login">
        <img src={store_icon} alt="Grovo" />
        <h1>Grovo</h1>
      </div>
      <div className="login-card">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* <p id="varification-check">
              {userData.isVerified ? (
                <span id="varify">Email is varified</span>
              ) : (
                <>
                  <span id="not-varify">Email is not varified</span>{" "}
                  <Link to="/verify-otp" state={{ email: userData.email }}>
                    Varify email
                  </Link>
                </>
              )}
            </p> */}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button id="Signin" type="submit">
            Sign In
          </button>
        </form>
        <Link to="/signup" className="switch-auth-link">
          Don't have an account? <span>Sign Up</span>
        </Link>
      </div>
      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
};

export default LogIn;
