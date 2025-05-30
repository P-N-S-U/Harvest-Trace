import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/ObviouslyNotAdmin/login", formData);

      if (response.data && response.data.token) {
        const { token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", "admin");
        navigate("/AdminDashboard");
      } else {
        throw new Error("Invalid admin credentials.");
      }
    } catch (error) {
      setError("Invalid admin credentials. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="admin-login-header">
        <h2>Admin Login</h2>
        <p className="admin-subtitle">Access the administration dashboard</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Admin Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter admin email"
            value={formData.email}
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
            placeholder="Enter admin password"
            value={formData.password}
            required
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="btn custom-green-btn w-100 login-btn"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In as Admin"}
        </button>
      </form>

      <style>
        {`
          .auth-container {
            max-width: 450px;
            margin: 190px auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            background-color: #fff;
          }
          
          .admin-login-header {
            text-align: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
          }
          
          .admin-login-header h2 {
            color: #333;
            font-weight: 700;
            margin-bottom: 5px;
          }
          
          .admin-subtitle {
            color: #666;
            font-size: 0.9rem;
          }
          
          .form-group {
            margin-bottom: 20px;
          }
          
          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #444;
          }
          
          .form-control {
            width: 100%;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            transition: border-color 0.3s;
          }
          
          .form-control:focus {
            border-color: #01c64b;
            outline: none;
            box-shadow: 0 0 0 3px rgba(1, 198, 75, 0.2);
          }
          
          .custom-green-btn {
            background-color: #01c64b !important; 
            color: white !important;
            border: none;
            padding: 12px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out, transform 0.2s;
          }
          
          .custom-green-btn:hover {
            background-color: #1e990f !important;
            transform: scale(1.02);
          }
          
          .custom-green-btn:disabled {
            background-color: #7ccb95 !important;
            cursor: not-allowed;
            transform: none;
          }
          
          .alert {
            padding: 12px;
            margin-bottom: 20px;
            border-radius: 4px;
          }
          
          .alert-danger {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
          }
        `}
      </style>
    </div>
  );
};

export default AdminLogin;