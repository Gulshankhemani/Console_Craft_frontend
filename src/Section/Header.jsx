import { useState } from "react";
import Sidebar from "../Components/Sidebar.jsx";
import LoginIcon from "@mui/icons-material/Login";
import logo from "../Assets/logo.png";
import { Link } from "react-router-dom";
import Button from "../Components/Button.jsx";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  const handleSearch = (event) => {
    event.preventDefault(); // Prevent page reload
    const searchQuery = event.target.search.value; // Get search input value
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="flex flex-wrap gap-10 py-3 pr-8 pl-20 w-full bg-gradient-to-r from-gray-900 via-purple-700 to-cyan-400 max-md:px-5 max-md:max-w-full">
      {/* Hamburger Menu */}
      <button
        className="text-gray-200 text-2xl my-auto focus:outline-none hover:scale-105 p-2 rounded-md transition-all duration-200"
        onClick={openSidebar}
      >
        ☰
      </button>

      {/* Logo */}
      <Link to="/">
        <img
          loading="lazy"
          src={logo || "/placeholder.svg"}
          alt="Logo"
          className="w-[170px] my-auto object-contain hover:brightness-75 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:scale-105 transform transition-transform duration-200 ease-in-out filter invert brightness-0 contrast-100"
        />
      </Link>

      {/* Search Bar */}
      <form
        className="flex flex-1 gap-3.5 px-4 py-2.5 my-auto text-sm text-center text-gray-900 bg-gradient-to-r from-gray-900 via-purple-700 to-cyan-400 max-md:px-5 rounded-2xl border border-solid border-white items-center hover:border-purple-600 transition-all duration-200"
        onSubmit={handleSearch}
      >
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6a74799e828d2ec913cd21ac7ffd37a63dbb9165e09b014e5594e15e6573d84f?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2"
          alt="Search Icon"
          className="w-[15px] object-contain shrink-0 bg-blend-normal aspect-square"
        />
        <input
          type="search"
          placeholder="Search"
          aria-label="Search"
          className="flex-auto bg-transparent text-white placeholder-gray-200 border-none focus:outline-none"
        />
      </form>

      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />

      {/* Background Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={closeSidebar}
      ></div>

      {/* Profile & Language */}
      <div className="flex flex-1 gap-10 justify-center  items-center">
        <div className="flex gap-3 text-sm font-semibold text-gray-900 items-center">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a5f5e84c8782739c3018aaf219371a03a62d1f22319639f2440ce89d5a801b2d?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2"
            alt="Language selector"
            className="w-10 object-contain aspect-[1.48]"
          />
          <Link to="/language">
            <button className="flex items-center py-2 focus:outline-none hover:text-purple-600">
              <span className="text-lg">ENGLISH</span>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f53b92479fa941bc5167c5f9ba429fa60c12bb10b7a6bfb5d2c0b4a8d5dfa936?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2"
                alt="Arrow"
                className="w-2 object-contain aspect-[2] ml-2"
              />
            </button>
          </Link>
        </div>
        <div className="flex gap-3 text-sm font-semibold text-gray-900 items-center">
          <Link to="/return-order" className="hover:text-purple-600">
            <button className="flex items-center focus:outline-none hover:text-purple-600">
              <span className="text-lg">Return & Order</span>
            </button>
          </Link>
        </div>
        <div className="flex items-center text-gray-900">
          <Link
            to="/login"
            className="flex items-center gap-3 hover:text-purple-600"
          >
            <LoginIcon className="w-11 object-contain shrink-0" />
            <Button
              name="login"
              containerclass="min-w-[120px] px-4 py-2 text-center"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
