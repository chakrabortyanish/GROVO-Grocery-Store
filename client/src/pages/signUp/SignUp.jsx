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
        toast.warning(validationErrors.firstName);
      }
      if (validationErrors.lastName) {
        toast.warning(validationErrors.lastName);
      }
      if (validationErrors.email) {
        toast.warning(validationErrors.email);
      }
      if (validationErrors.password) {
        toast.warning(validationErrors.password);
      }
    } else {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          },
        );
        const result = await response.json();
        const { message, success } = result;
        if (success) {
          toast.success("OTP sent to your email");

          navigate("/verify-otp", {
            state: {
              email: formData.email,
            },
          });
          /* toast.success(message, {
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
          }, 2000); */
        } else {
          toast.warning(message);
        }
      } catch (err) {
        toast.warning(err);
      }
    }
  };
  return (
    <div className="signup-container">
  <div className="heading-signup">
    <img src={store_icon} alt="Grovo" />
    <h1>Grovo</h1>
  </div>
  <div className="form-card">
    <h2>Create Your Account</h2>
    <form onSubmit={handleSubmit}>
      <div className="name-row">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label>Email Address <p id="opt-text">**(Should be valid for OTP verification)**</p></label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
      </div>
      <button id="submit" type="submit">
        Create Account
      </button>
    </form>
    <Link to="/login" className="already-account">
      Already have an account? <span>Login</span>
    </Link>
  </div>
  <ToastContainer position="top-right" autoClose={1500}/>
</div>
  );
};

export default SignUp;
