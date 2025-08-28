import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === null || savedMode === "true"; // Default to dark mode
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

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
              <Link className="nav-link" to="/create-post">Create Post</Link>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
