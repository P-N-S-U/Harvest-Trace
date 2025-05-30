import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react"; // Icons for Sidebar
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  // const isAdmin = true; // ✅ Change this based on auth logic

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in (Modify this logic based on your authentication method)
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    setUserRole(role);
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    navigate("/");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.reload();
  };

  return (
    <>
      {/* Main Header */}
      <header
        className="d-flex justify-content-between align-items-center p-3 shadow fixed-top"
        style={{ backgroundColor: "#f1fdf6" }}
      >
        {/* Logo */}
        <div className="d-flex align-items-center">
          <img src="/logo.png" alt="" style={{ height: "3rem" }} />
          <h1 className="ms-2 text-black">HarvestTrace</h1>
        </div>

        {/* Navigation for Desktop */}
        <nav className="d-none d-md-block">
          <ul className="nav">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link text-black ${
                  location.pathname === "/" ? "active" : ""
                }`}
              >
                Home
              </Link>
            </li>
            {/* <li className="nav-item"><a href="#how-it-works" className="nav-link text-black">How It Works</a></li>
            <li className="nav-item"><a href="#farmers" className="nav-link text-black">For Farmers</a></li>
            <li className="nav-item"><a href="#consumers" className="nav-link text-black">For Consumers</a></li> */}
            <li className="nav-item">
              <a href="#about" className="nav-link text-black">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <Link
                to="/marketplace"
                className={`nav-link text-black ${
                  location.pathname === "/marketplace" ? "active" : ""
                }`}
              >
                Marketplace
              </Link>
            </li>
          </ul>
        </nav>

        {/* Buttons for Desktop */}
        <div className="d-none d-md-block">
          {isLoggedIn ? (
            <>
              {/* ✅ Show Cart icon only if userRole is "consumer" */}
              {userRole === "consumer" && (
                <Link to="/cart" className="btn marketplace-btn rounded-pill me-2">
                  <ShoppingCart size={20} />
                </Link>
              )}

              {/* ✅ Logout Button visible for both consumer and farmer */}
              <button
                className="btn logout-btn rounded-pill"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn login-btn rounded-pill me-2">
                Log In
              </Link>
              <Link to="/register" className="btn signup-btn rounded-pill">
                Sign Up
              </Link>
            </>
          )}

        </div>

        {/* Mobile Menu Button */}
        <button
          className="d-md-none btn btn-outline-light"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={24} color="black" />
        </button>
      </header>

      {/* Sidebar for Mobile */}
      <div className={`mobile-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>
          <X size={24} />
        </button>
        <nav>
          <ul>
            <li>
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
                onClick={() => setIsSidebarOpen(false)}
              >
                Home
              </Link>
            </li>
            {/* <li><a href="#how-it-works" onClick={() => setIsSidebarOpen(false)}>How It Works</a></li>
            <li><a href="#farmers" onClick={() => setIsSidebarOpen(false)}>For Farmers</a></li>
            <li><a href="#consumers" onClick={() => setIsSidebarOpen(false)}>For Consumers</a></li> */}
            <li>
              <a href="#about" onClick={() => setIsSidebarOpen(false)}>
                About Us
              </a>
            </li>
            <li>
              <Link
                to="/#"
                className={location.pathname === "/#" ? "active" : ""}
                onClick={() => setIsSidebarOpen(false)}
              >
                Marketplace
              </Link>
            </li>
          </ul>
          {/* Log In & Sign Up Buttons Inside Sidebar */}
          <div className="sidebar-buttons">
            {isLoggedIn ? (
              <>
                {/* ✅ Show Cart icon only if userRole is "consumer" */}
                {userRole === "consumer" && (
                  <Link
                    to="/cart"
                    className="btn marketplace-btn w-100 mb-2"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <ShoppingCart size={20} />
                  </Link>
                )}
                {/* ✅ Logout Button */}
                <button
                  className="btn logout-btn w-100"
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn login-btn w-100 mb-2"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn signup-btn w-100"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Styles */}
      <style>
        {`
          .nav-link.active {
            font-weight: bold;
            border-bottom: 2px solid #01c64b;
          }

          .login-btn {
            border: 2px solid #01c64b;
            color: #01c64b;
            transition: background 0.3s ease-in-out, color 0.3s ease-in-out;
          }

          .marketplace-btn {
            background: #ffcc00;
            color: black;
            transition: background 0.3s ease-in-out;
          }

          .marketplace-btn:hover {
            background: #e6b800;
          }

          .login-btn:hover {
            background: #01c64b;
            color: white;
          }

          .signup-btn {
            background: #01c64b;
            color: white;
            transition: background 0.3s ease-in-out;
          }

          .signup-btn:hover {
            background: #019c3d;
          }

          .mobile-sidebar {
            position: fixed;
            top: 0;
            right: -100%;
            width: 250px;
            height: 100%;
            background: #f1fdf6;
            color: black;
            padding: 20px;
            transition: right 0.3s ease-in-out;
            display: flex;
            flex-direction: column;
            z-index: 1050;
          }

          .mobile-sidebar.open {
            right: 0;
          }

          .mobile-sidebar .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: black;
            font-size: 24px;
            cursor: pointer;
          }

          .mobile-sidebar ul {
            list-style: none;
            padding: 0;
          }

          .mobile-sidebar ul li {
            padding: 10px 0;
          }

          .mobile-sidebar ul li a {
            color: black;
            text-decoration: none;
            font-size: 18px;
          }

          .mobile-sidebar ul li a.active {
            font-weight: bold;
            border-bottom: 2px solid #01c64b;
          }

          .sidebar-buttons {
            margin-top: 20px;
          }

          .logout-btn {
        background: #dc3545;
        color: white;
        transition: background 0.3s ease-in-out;
        }

        .logout-btn:hover {
        background: #b02a37;
        }
        `}
      </style>
    </>
  );
};

export default Header;
