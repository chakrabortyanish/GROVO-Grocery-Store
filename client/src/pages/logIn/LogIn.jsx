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
  const [userData, serUserData] = useState(null);
  const [checkingData, setCheckingData] = useState(true);

  console.log("email", email);
  console.log("user", userData);

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

  useEffect(() => {
    getUserData();
  }, [email]);

  const getUserData = async () => {
    setCheckingData(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/check-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // toast.success(result.message);
        serUserData(result.user); // Note: check if this is a typo for setUserData
      } else {
        serUserData(null);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // toast.error("Something went wrong. Please try again.");
      serUserData(null); 
    } finally {
      setCheckingData(false);
    }
  };

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
            <p id="varification-check">
              {userData ? (
                userData.isVerified ? (
                  <span id="verify" style={{ color: "green" }}>
                    Email is verified
                  </span>
                ) : (
                  <>
                    <span id="not-verify" style={{ color: "red" }}>
                      Email is not verified
                    </span>
                    <Link to="/verify-otp" state={{ email: userData.email }}>
                      Verify email
                    </Link>
                  </>
                )
              ) : (
                <span style={{ color: "red" }}>User not found</span>
              )}
            </p>
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
          <button id="Signin" type="submit" disabled={checkingData}>
            {checkingData? "Checking email...": "Sign In"}
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
