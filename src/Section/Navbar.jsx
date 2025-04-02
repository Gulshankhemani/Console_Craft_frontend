import React, { useRef, useState, useEffect } from "react";
import Button from "../Components/Button.jsx";
import { useWindowScroll } from "react-use";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import gsap from "gsap";
import clsx from "clsx";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Deals", path: "/deals" },
  { name: "Gift_Card", path: "/gift_card" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const isAuthenticated = !!localStorage.getItem("token");

  // Check if we're on the homepage (/)
  const isHomePage = location.pathname === "/";

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  const handleSignout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
      // On non-homepage routes, keep navbar static and visible
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
      return;
    }

    // Homepage-specific scroll behavior
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
      // On non-homepage routes, ensure navbar stays visible without animation
      gsap.set(navContainerRef.current, { y: 0, opacity: 1 });
      return;
    }

    // GSAP animation only on homepage
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
            <img src="/img/logo.png" alt="logo" className="w-10" />
            <Button
              name="Product"
              containerclass="bg-blue-50 md:flex hidden item-center justify-center gap-1"
            />
          </div>

          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="nav-hover-btn"
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <button
                  onClick={handleSignout}
                  className="nav-hover-btn"
                >
                  Signout
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
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
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