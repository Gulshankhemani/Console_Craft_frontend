import { useState } from "react"
import Sidebar from "../Components/Sidebar.jsx"
import LoginIcon from "@mui/icons-material/Login"
import logo from "../Assets/logo.png"
import { Link } from "react-router-dom"

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const openSidebar = () => setSidebarOpen(true)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex flex-wrap gap-10 py-3 pr-8 pl-20 w-full bg-gradient-to-r from-black via-green-800 to-black max-md:px-5 max-md:max-w-full">
      {/* Hamburger Menu */}
      <button
        className="text-green-400 text-2xl my-auto focus:outline-none hover:bg-green-800 p-2 rounded-md transition-all duration-200"
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
          className="object-contain shrink-0 bg-blend-normal aspect-auto w-[170px] my-auto hover:brightness-75"
        />
      </Link>

      {/* Search Bar */}
      <form className="flex flex-1 gap-3.5 px-4 py-2.5 my-auto text-sm text-center text-green-300 whitespace-nowrap bg-black rounded-2xl border border-solid border-green-700 items-center hover:bg-green-900 hover:border-green-500 transition-all duration-200">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6a74799e828d2ec913cd21ac7ffd37a63dbb9165e09b014e5594e15e6573d84f?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2"
          alt=""
          className="object-contain shrink-0 bg-blend-normal aspect-square w-[15px]"
        />
        <input
          type="search"
          placeholder="Search"
          aria-label="Search"
          className="flex-auto bg-transparent text-green-300 placeholder-green-500 border-none focus:outline-none"
        />
      </form>

      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />

      {/* Background Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${sidebarOpen ? "block" : "hidden"}`}
        onClick={closeSidebar}
      ></div>

      {/* Profile & Language */}
      <div className="flex flex-1 gap-15 justify-end">
        <div className="flex gap-3 my-auto text-sm font-semibold whitespace-nowrap text-green-300">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a5f5e84c8782739c3018aaf219371a03a62d1f22319639f2440ce89d5a801b2d?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2"
            alt="Language selector"
            className="object-contain shrink-0 self-start mt-1 w-10 rounded-none aspect-[1.48]"
          />
          <Link to="/language" className="hover:text-green-400">
            <button className="flex items-center py-2 focus:outline-none hover:text-green-400">
              <span>English</span>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f53b92479fa941bc5167c5f9ba429fa60c12bb10b7a6bfb5d2c0b4a8d5dfa936?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2"
                alt="hello"
                className="object-contain shrink-0 my-auto w-2 aspect-[2] ml-2"
              />
            </button>
          </Link>
        </div>
        <div className="flex gap-3 my-auto text-sm font-semibold whitespace-nowrap text-green-300">
          <Link to="/return-order" className="hover:text-green-400">
            <button className="flex items-center focus:outline-none hover:text-green-400">
              <span>Return & Order</span>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f53b92479fa941bc5167c5f9ba429fa60c12bb10b7a6bfb5d2c0b4a8d5dfa936?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2"
                alt="hello"
                className="object-contain shrink-0 my-auto w-2 aspect-[2] ml-2"
              />
            </button>
          </Link>
        </div>
        <div className="flex gap-5 items-center text-green-300">
          <LoginIcon className="object-contain shrink-0 self-stretch w-11 aspect-square my-3 hover:text-green-400 " />
          <Link to="/login" className="hover:text-green-400">
            <button className="flex items-center focus:outline-none hover:text-green-400">
              <div className="flex flex-col self-stretch my-auto ">
                <div className="text-sm font-bold hover:text-green-400">Login</div>
              </div>
            </button>
          </Link>
          <button aria-label="User menu" className="focus:outline-none">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/488e0b8204e493b859ff72343f9fb335a7786db8e99e4abdfae2772af32a683f?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2"
              alt=""
              className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header

