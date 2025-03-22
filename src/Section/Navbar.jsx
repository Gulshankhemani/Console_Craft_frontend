import React from "react";
import Button from "../Components/Button.jsx";
import { useRef } from "react";
import { Link } from "react-router-dom";

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Deals', path: '/deals' },
  { name: 'Gift_Card', path: '/gift_card' },
  { name: 'Contact', path: '/contact' },
  { name: 'Login', path: '/login' }
];

const Navbar = () => {
  const navContainer = useRef(null);

  return (
    <div
      ref={navContainer}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full justify-between items-center p-0">
          <div className="flex items-center gap-7">
            <img src="/img/logo.png" alt="logo" className="w-10" />
            <Button
              name="Product"
              containerclass="bg-blue-50 md:flex hidden item-center justify-center gap-1"
            />
          </div>
          <div className="flex h-full items-center ">
            <div className="hidden md:block">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className="nav-hover-btn">{item.name}</Link>
              ))}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
