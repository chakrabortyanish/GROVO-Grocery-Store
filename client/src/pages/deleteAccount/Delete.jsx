import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Delete.css";
import "../logIn/LogIn.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Swal from "sweetalert2";

import store_icon from "../../assets/image.png";

import { CartContext } from "../../components/contextAPI/cartContext.jsx";

const Delete = () => {
  const navigate = useNavigate();

  const { setCartCount } = useContext(CartContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmDelete  = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to recover this account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmDelete.isConfirmed) {
      return; // ❌ Stop if user cancels
    }

    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    // console.log(result);
    const { message, success } = result;
    // console.log(Name);
    // alert(message);
    if (success) {
      localStorage.removeItem("token");
      localStorage.removeItem("items");
      setCartCount(0); 
      toast.success(message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      console.log("wrong", message);
      toast.warning(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
    // console.log("Email:", email, "Password:", password);
  };
  return (
    <div className="login-container">
      <div className="heading-login">
        <img src={store_icon} alt="Grovo" />
        <h1>Grovo</h1>
      </div>
      <div className="login-box">
        <h2 id="del-h2">Delete Account</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            className="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="SignIn" type="submit">
            Delete Account
          </button>
        </form>
        <Link to="/" id="go-back">
          Go Back
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Delete;
