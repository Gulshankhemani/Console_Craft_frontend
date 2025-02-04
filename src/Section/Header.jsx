import { useState } from "react";
import Sidebar from "../Components/Sidebar.jsx";
import LoginIcon from "@mui/icons-material/Login";
import logo from "../Assets/logo.png";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex items-center justify-between py-3 px-5 w-full bg-gradient-to-r from-black via-green-800 to-black">
      {/* Hamburger Menu for Mobile */}
      <button
        className="text-green-400 text-2xl md:hidden focus:outline-none hover:bg-green-800 p-2 rounded-md transition-all duration-200"
        onClick={openSidebar}
      >
        <MenuIcon />
      </button>

      {/* Logo */}
      <Link to="/">
        <img
          loading="lazy"
          src={logo || "/placeholder.svg"}
          alt="Logo"
          className="w-28 sm:w-36 object-contain hover:brightness-75 hover:scale-105 transform transition-transform duration-200"
        />
      </Link>

      {/* Search Bar (Hidden on Mobile) */}
      <form className="hidden md:flex flex-1 gap-3 px-4 py-2 text-sm text-green-300 bg-black rounded-2xl border border-green-700 items-center hover:bg-green-900 hover:border-green-500 transition-all duration-200">
        <input
          type="search"
          placeholder="Search"
          aria-label="Search"
          className="flex-auto bg-transparent text-green-300 placeholder-green-500 border-none focus:outline-none"
        />
      </form>

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={closeSidebar}
      ></div>

      {/* Profile & Options (Hidden on Mobile, Shown in Sidebar) */}
      <div className="hidden md:flex items-center gap-6 text-green-300">
        <Link to="/return-order" className="hover:text-green-400">
          Return & Order
        </Link>
        <Link to="/language" className="hover:text-green-400">
          English
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-2 hover:text-green-400"
        >
          <LoginIcon className="w-6 h-6" />
          <span className="text-sm font-bold">Login</span>
        </Link>
      </div>
    </div>
  );
};

export default Header;