import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "./VerifyOTP.css";

const VerifyOTP = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  // disable state
  const [timer, setTimer] = useState(60);
  const [disabled, setDisabled] = useState(true);

  const verifyOTP = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/user/verify-otp`,

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          otp,
        }),
      },
    );

    const result = await response.json();

    if (result.success) {
      toast.success(result.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      toast.error(result.message);
    }
  };

  const resendOTP = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/user/resend-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );

  const result = await response.json();

  if (result.success) {
    toast.success(result.message);

    setTimer(60);
    setDisabled(true);
  } else {
    toast.error(result.message);
  }
};

  // de
  useEffect(() => {
  if (!disabled) return;

  const interval = setInterval(() => {
    setTimer((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        setDisabled(false);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [disabled]);

  return (
    <div className="otp-container">
      <div className="otp-card">
        <div className="otp-icon-wrapper">
          {/* A clean, modern envelope/shield lock placeholder icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="otp-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
        </div>
        <h2>Verify Your Email</h2>
        <p className="otp-subtitle">
          We sent a 6-digit verification code to <br />
          <span className="user-email">{email}</span>
        </p>

        <form onSubmit={verifyOTP}>
          <div className="form-group">
            <input
              type="text"
              placeholder="000000"
              value={otp}
              maxLength={6}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              } /* Restricts input to numbers only */
              required
            />
          </div>

          <button id="verify-submit" type="submit">
            Verify Code
          </button>
        </form>

        <div className="resend-wrapper">
          <p>
            Didn't receive the code?{" "}
            <button className="resend-link" onClick={resendOTP}  disabled={disabled}>
              {disabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
};

export default VerifyOTP;
