import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import store_icon from "../../assets/image.png";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  /* const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Firstname is required.";
    if (!formData.lastName) newErrors.lastName = "Lastname is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters long.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Submitting:", formData);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      // console.log(validationErrors);
      if (validationErrors.firstName) {
        toast.warning(validationErrors.firstName, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
      if (validationErrors.lastName) {
        toast.warning(validationErrors.lastName, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
      if (validationErrors.email) {
        toast.warning(validationErrors.email, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
      if (validationErrors.password) {
        toast.warning(validationErrors.password, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } else {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        const result = await response.json();
        const { message, success } = result;
        if (success) {
          toast.success(message, {
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
        } else {
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
      } catch (err) {
        toast.warning(err, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    }
  };
  return (
    <div className="signup-container">
      <div className="heading-signup">
        <img src={store_icon} alt="Grovo" />
        <h1>Grovo</h1>
      </div>
      <div className="container">
        <h2>REGISTRATION</h2>
        <form onSubmit={handleSubmit}>
          <div className="name from-text">
            <div className="fullname">
              <div className="first-name">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName.toLowerCase()}
                  onChange={handleChange}
                />
              </div>
              <div className="last-name">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName.toLowerCase()}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="mail from-text">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="password from-text">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button id="submit" type="submit">
            Create Account
          </button>
        </form>
        <Link to="/login" className="already-account">
          Already have an account? Login
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
