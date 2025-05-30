import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("password");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const [consumerResponse, farmerResponse] = await Promise.allSettled([
        axios.post("http://localhost:5000/consumer/login", formData),
        axios.post("http://localhost:5000/farmers/login", formData),
      ]);

      if (
        consumerResponse.status === "fulfilled" &&
        consumerResponse.value.data.token
      ) {
        const { token } = consumerResponse.value.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", "consumer");
        navigate("/marketplace");
        window.location.reload();
      } else if (
        farmerResponse.status === "fulfilled" &&
        farmerResponse.value.data.token
      ) {
        const { token } = farmerResponse.value.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", "farmer");
        navigate("/farmerdashboard");
      } else {
        throw new Error("Invalid email or password.");
      }
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <div className="toggle-buttons">
        <button
          className={`btn ${
            loginMethod === "password" ? "custom-green-btn" : "btn-light"
          }`}
          onClick={() => setLoginMethod("password")}
        >
          Username & Password
        </button>
        <button
          className={`btn ${
            loginMethod === "otp" ? "custom-green-btn" : "btn-light"
          }`}
          onClick={() => setLoginMethod("otp")}
        >
          OTP
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        {loginMethod === "password" ? (
          <>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                required
                onChange={handleChange}
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="Enter your phone number"
                required
                onChange={handleChange}
              />
            </div>
            <button type="button" className="btn btn-warning w-100 otp-btn">
              Send OTP
            </button>
            <div className="form-group">
              <label>OTP</label>
              <input
                type="text"
                name="otp"
                className="form-control"
                placeholder="Enter OTP"
                required
                onChange={handleChange}
              />
            </div>
          </>
        )}
        <button type="submit" className="btn custom-green-btn w-100 login-btn">
          Login
        </button>
        <p className="login-text">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </form>
      <style>
        {`
          .custom-green-btn {
            background-color: #01c64b !important; 
            color: white !important;
            border: none;
            transition: background-color 0.3s ease-in-out, transform 0.2s;
          }
          
          .custom-green-btn:hover {
            background-color: #1e990f !important; /* Darker green */
            transform: scale(1.05);
          }

          .otp-btn {
            transition: background-color 0.3s ease-in-out, transform 0.2s;
          }

          .otp-btn:hover {
            background-color: #e0a800 !important; /* Darker warning color */
            transform: scale(1.05);
          }

          .login-btn {
            transition: background-color 0.3s ease-in-out, transform 0.2s;
          }

          .login-btn:hover {
            background-color: #1e990f !important; /* Darker green */
            transform: scale(1.05);
          }
        `}
      </style>
    </div>
  );
};

export default Login;
