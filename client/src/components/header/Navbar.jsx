import React, { useState, useRef, useEffect, useContext } from "react";
import "./Navbar.css";

import { useNavigate, Link } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BsCart3 } from "react-icons/bs";
import store_icon from "../../assets/image.png";
import { HiOutlineMenuAlt2 } from "react-icons/hi";

import { CartContext } from "../../components/contextAPI/cartContext.jsx";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const iconRef = useRef(null);

  const username = localStorage.getItem("Username");
  const { cartCount } = useContext(CartContext);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("Username");
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const handleDeleteAccount = () => {
    navigate("/delete");
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header>
      {/* Toggle menu (only visible if menuOpen is true) */}
      {menuOpen && (
        <div className="menu-container" ref={menuRef}>
          <ul className="menu-links">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#categories">Categories</a>
            </li>
            <li>
              <a href="#packages">Packages</a>
            </li>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
            <li>
              <a href="#feedback">Feedback</a>
            </li>
            <li>
              <a href="#about">About us</a>
            </li>
          </ul>
        </div>
      )}
      <div className="heading">
        <HiOutlineMenuAlt2
          size={27}
          className="menu-icon"
          ref={iconRef}
          onClick={() => setMenuOpen((prev) => !prev)}
        />
        <img src={store_icon} alt="Grovo" />
        <h1>Grovo</h1>
      </div>
      <div className="links">
        <ul>
          <li>
            <a href="">Home</a>
          </li>
          <li>
            <a href="#categories">Categories</a>
          </li>
          <li>
            <a href="#packages">Packages</a>
          </li>
          <li>
            <a href="">Contact Us</a>
          </li>
          <li>
            <a href="">Feedback</a>
          </li>
          <li>
            <a href="">About us</a>
          </li>
        </ul>
      </div>
      <div className="right-side">
        <div className="account-container">
          <div className="acc">
            {username ? username : <Link to="/login">Sign In</Link>}
          </div>
          <div className="mg-acc">
            {username && (
              <div className="mg-content">
                <button id="logout" onClick={handleLogout}>
                  Logout
                </button>
                <button id="delete-account" onClick={handleDeleteAccount}>
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
        <Link to="/cart">
          <div className="cart">
            <span>{cartCount}</span>
            <BsCart3 size={27} className="icon" />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
