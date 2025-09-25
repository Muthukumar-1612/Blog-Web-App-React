import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetAuthState, user_logout } from "../store/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === null || savedMode === "true"; // Default to dark mode
  });

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleCreatePost = (e) => {
    if (!user) {
      e.preventDefault();
      toast.error("Please login to create a post");
      navigate("/login");
    } else {
      navigate("/create-post");
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(user_logout()).unwrap();  // wait until backend confirms logout
      dispatch(resetAuthState());              // clear Redux state
      navigate("/");                           // now go home
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark" id="nav1">
      <div className="container-fluid">

        <Link className="navbar-brand" to="/">Anime Blogs</Link>

        <div className="d-flex align-items-center ms-auto order-sm-2 me-3">
          <i
            id="darkModeToggle"
            className={`bi ${darkMode ? "bi-sun-fill" : "bi-moon-fill"} fs-4 text-white`}
            style={{ cursor: "pointer" }}
            onClick={() => setDarkMode(prev => !prev)}
          ></i>
        </div>

        <button
          className="navbar-toggler order-sm-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsExample03"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse order-sm-1" id="navbarsExample03">
          <ul className="navbar-nav ms-auto mb-2 mb-sm-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item me-2">
              <button
                className="nav-link btn btn-link"
                onClick={handleCreatePost}
                style={{
                  textDecoration: "none",
                  border: "none",
                  background: "transparent",
                  color: "white"
                }}
              >
                Create Post
              </button>
            </li>
            {/* User display and logout */}
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-light">
                    <i className="bi bi-person-circle me-1"></i>
                    {user.name}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-light"
                    onClick={handleLogout}
                    style={{
                      textDecoration: 'none',
                      border: 'none',
                      background: 'transparent'
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item me-2">
                <Link className="nav-link" to="/login" state={{ from: location }} >
                  Login/Register
                </Link>
              </li>
            )}
          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
