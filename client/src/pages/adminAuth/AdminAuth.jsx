import React, { useState } from "react";
import "./AdminAuth.css";

import { useNavigate } from "react-router-dom";

import store_icon from "../../assets/image.png";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminAuth = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUsername", data.admin.username);

      toast.success("Admin Login Successful");

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);
    } catch (error) {
      toast.error(error.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="heading" id="app-logo-container">
        <img src={store_icon} alt="Grovo" />
        <h1>Grovo</h1>
      </div>

      <div className="admin-auth-card">
        <h2>Admin Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
};
export default AdminAuth;
