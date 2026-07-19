import React, { useState, useRef, useEffect, useContext } from "react";
import "./Navbar.css";

import { Link } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

import { BsCart3 } from "react-icons/bs";
import store_icon from "../../assets/image.png";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { MdOutlineArrowDropDown } from "react-icons/md";

import { FaRegUserCircle } from "react-icons/fa";

import { CartContext } from "../../components/contextAPI/cartContext.jsx";
import UserMenu from "../userMenu/UserMenu.jsx";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const iconRef = useRef(null);

  const { cartCount } = useContext(CartContext);

  const userToken = localStorage.getItem("token");

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
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/#categories">Categories</Link>
            </li>
            <li>
              <Link to="/#packages">Packages</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/feedback">Feedback</Link>
            </li>
            <li>
              <Link to="/about">About us</Link>
            </li>
          </ul>
        </div>
      )}
      <Link to="/">
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
      </Link>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/#categories">Categories</Link>
          </li>
          <li>
            <Link to="/#packages">Packages</Link>
          </li>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
          <li>
            <Link to="/feedback">Feedback</Link>
          </li>
          <li>
            <Link to="/about">About us</Link>
          </li>
        </ul>
      </div>
      <div className="right-side">
        <div className="user-menu">
          <UserMenu />
          {!userToken && (
            <Link to="/admin-auth">
              <button className="admin-btn">Admin</button>
            </Link>
          )}
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
