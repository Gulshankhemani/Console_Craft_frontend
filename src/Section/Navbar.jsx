import React, { useRef, useState, useEffect } from "react";
import Button from "../Components/Button.jsx";
import { useWindowScroll } from "react-use";
import { Link, useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";
import clsx from "clsx";
import axios from "axios";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Deals", path: "/deals" },
  { name: "Gift_Card", path: "/gift_card" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [userAvatar, setUserAvatar] = useState(null);

  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get( `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/current-user`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const avatarUrl = response.data.message.avatar; // ApiResponse: { data: user }
      setUserAvatar(avatarUrl || "https://via.placeholder.com/32"); // Fallback like Comment.jsx
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      if (error.response?.status === 401) {
        try {
          const newToken = await refreshToken();
          const retryResponse = await axios.get( `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/current-user`, {
            headers: { Authorization: `Bearer ${newToken}` },
            withCredentials: true,
          });
          const avatarUrl = retryResponse.data.data.avatar;
          setUserAvatar(avatarUrl || "https://via.placeholder.com/32");
          setIsAuthenticated(true);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          setUserAvatar(null);
          setIsAuthenticated(false);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      } else {
        setUserAvatar(null);
        setIsAuthenticated(false);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile(token);
    } else {
      setUserAvatar(null);
      setIsAuthenticated(false);
    }

    const handleAuthChange = () => {
      const newToken = localStorage.getItem("token");
      if (newToken) {
        fetchUserProfile(newToken);
      } else {
        setUserAvatar(null);
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []); // Run once on mount

  const refreshToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) throw new Error("No refresh token found");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/refresh-token`,
        { refreshToken: storedRefreshToken },
        { withCredentials: true }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      return accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  };

  const handleSignout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/logout`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
      setUserAvatar(null);
      window.dispatchEvent(new Event("authChange"));
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);

      if (error.response?.status === 401) {
        try {
          const newToken = await refreshToken();
          await axios.post(
           `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/logout`,
            {},
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${newToken}` },
            }
          );

          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          setIsAuthenticated(false);
          setUserAvatar(null);
          window.dispatchEvent(new Event("authChange"));
          navigate("/");
        } catch (refreshError) {
          console.error("Refresh failed, forcing client-side logout:", refreshError);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          setIsAuthenticated(false);
          setUserAvatar(null);
          window.dispatchEvent(new Event("authChange"));
          navigate("/");
        }
      }
    }
  };

  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (!isHomePage) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
      return;
    }

    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY, isHomePage]);

  useEffect(() => {
    if (!isHomePage) {
      gsap.set(navContainerRef.current, { y: 0, opacity: 1 });
      return;
    }

    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible, isHomePage]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex items-center gap-7">
            <img
              src={isAuthenticated && userAvatar ? userAvatar : "/img/logo.png"}
              alt={isAuthenticated && userAvatar ? "User Avatar" : "Logo"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <Link to="/cart">
              <Button
                name="Cart"
                containerclass="bg-blue-50 md:flex hidden item-center justify-center gap-1 w-64"
              />
            </Link>
          </div>

          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className="nav-hover-btn">
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <button onClick={handleSignout} className="nav-hover-btn">
                  Log out
                </button>
              ) : (
                <Link to="/login" className="nav-hover-btn">
                  Login
                </Link>
              )}
            </div>

            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {[1, 2, 3, 3].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{ animationDelay: `${bar * 0.1}s` }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;