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

  const { setCartCount, setUser } = useContext(CartContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmDelete = await Swal.fire({
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
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/user/delete`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );
    const result = await response.json();
    // console.log(result);
    const { message, success } = result;
    // console.log(Name);
    // alert(message);
    if (success) {
      localStorage.removeItem("token");
      localStorage.removeItem("items");
      localStorage.removeItem("deliveryAddress");
      setCartCount(0);
      setUser(null);
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
      <div className="delete-card">
        <h2>Delete Account</h2>
        <p className="delete-warning">
          Warning: This action is permanent. Please enter your credentials to
          confirm identity.
        </p>
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
          <button className="delete-btn" type="submit">
            Delete Account
          </button>
        </form>
        <Link to="/" className="go-back-link">
          Cancel & Go Back
        </Link>
      </div>
      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
};

export default Delete;
