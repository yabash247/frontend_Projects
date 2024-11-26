import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks";
import { logout } from "../features/auth/authSlice";
import { api } from "../utils/api";
import { backendURL } from "../utils/Constant"

const Navbar: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [canGoForward, setCanGoForward] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    navigate("/login"); // Redirect to login
  };

  const fetchUserInfo = async (accessToken: string) => {
    try {
      const response = await fetch(backendURL + "/api/users/me/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        //console.log(data);
        setUserName(data.name || "User"); // Assume the user object contains a "name" property
      } else if (response.status === 401) {
        // If access token is expired, refresh it
        const newAccessToken = await api(backendURL + "/api/users/me/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (newAccessToken) {
          // Retry fetching user info with the new access token
          fetchUserInfo(newAccessToken);
        } else {
          handleLogout(); // Logout if refresh token is invalid
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      handleLogout(); // Logout on other errors
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchUserInfo(accessToken);
    } else {
      handleLogout(); // Logout if no access token is found
    }

    const handlePopState = () => {
      setCanGoForward(window.history.length > 1);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button onClick={() => navigate(-1)} className="nav-button">
          Back
        </button>
        <Link to="/" className="navbar-brand">
          Home
        </Link>
        <button
          onClick={() => navigate(1)}
          className="nav-button"
          disabled={!canGoForward}
        >
          Forward
        </button>
        <ul className="navbar-links">
          {userName ? (
            <>

              <li>
                <span className="navbar-user">Hello, {userName}!</span>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="navbar-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
