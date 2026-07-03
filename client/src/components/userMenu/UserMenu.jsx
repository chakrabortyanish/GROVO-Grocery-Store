import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import { CartContext } from "../../components/contextAPI/cartContext.jsx";

import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import {
  MdKeyboardArrowDown,
  MdOutlineShoppingBag,
  MdOutlineLocationOn,
  MdLogout,
  MdDeleteOutline,
} from "react-icons/md";

import { FaRegUserCircle } from "react-icons/fa";

import "./UserMenu.css";

const UserMenu = () => {
  const navigate = useNavigate();

   const { user, setUser } = useContext(CartContext);

  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      credentials: "include",
    });

    const data = await res.json();
    // console.log("logout res: ", data);
    const { message, success } = data;
    if (!success) {
      toast.error(message, {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    
    localStorage.removeItem("token");
    setUser(null);
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
      navigate("/");
    }, 2000);
  };

  const handleDeleteAccount = () => {
    navigate("/delete");
  };

  return (
    <div>
      {user ? (
        <div
          className="user-menu-container"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          {/* USER BUTTON */}

          <div className="user-menu-btn">
            <FaRegUserCircle className="user-icon" />

            <span>{user?.firstName}</span>

            <MdKeyboardArrowDown
              className={`dropdown-arrow ${showDropdown ? "rotate-arrow" : ""}`}
            />
          </div>

          {/* DROPDOWN */}

          <div
            className={`dropdown-menu ${showDropdown ? "show-dropdown" : ""}`}
          >
            <div className="dropdown-content">
              {/* TOP USER INFO */}

              <div className="dropdown-user-info">
                <FaRegUserCircle className="dropdown-user-icon" />

                <div>
                  <h3>{user?.firstName} {user?.lastName}</h3>
                  <p>Welcome Back 👋</p>
                </div>
              </div>

              {/* MENU ITEMS */}

              <Link to="/orders" className="dropdown-item">
                <MdOutlineShoppingBag />

                <span>Orders</span>
              </Link>

              <Link to="/cart" className="dropdown-item">
                <MdOutlineLocationOn />

                <span>Saved Address</span>
              </Link>

              <button
                className="dropdown-item logout-btn"
                onClick={handleLogout}
              >
                <MdLogout />

                <span>Logout</span>
              </button>

              <button
              id="delete-button"
                className="dropdown-item delete-btn"
                onClick={handleDeleteAccount}
              >
                <MdDeleteOutline />

                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Link to="/login" className="sign-in">
          <FaRegUserCircle /> Sign In
        </Link>
      )}

      {/* <ToastContainer /> */}
    </div>
  );
};

export default UserMenu;
