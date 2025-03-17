import PropTypes from "prop-types";

const Sidebar = ({ sidebarOpen, closeSidebar }) => {
  const menuItems = [
    "Dashboard",
    "Hero",
    "Favorites",
    "Inbox",
    "Order Lists",
    "Product Stock",
  ];

  const pageItems = [
    "Pricing",
    "Calendar",
    "To-Do",
    "Contact",
    "Invoice",
    "UI Elements",
    "Team",
    "Table",
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full w-[300px] bg-gradient-to-b from-purple-700 to-cyan-400 shadow-lg z-50 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <button
        className="absolute top-0 right-0 mt-5 mr-4 text-2xl text-gray-900 focus:outline-none"
        onClick={closeSidebar}
      >
        ×
      </button>
      <div className="flex flex-col grow pt-6 pb-28 w-full text-sm font-semibold text-gray-900 max-md:pb-24">
        <div className="self-center ml-3 max-w-full text-xl font-extrabold text-gray-900 bg-blend-normal shadow-[0px_-1px_0px_rgba(49,61,79,1)] w-[129px] max-md:pr-5">
          Consoel<span className="text-gray-900">Craft</span>
        </div>
        {menuItems.map((item) => (
          <button
            key={item}
            className="px-8 py-2 mt-4 tracking-wide whitespace-nowrap bg-transparent text-left hover:bg-green-800 focus:outline-none"
          >
            {item}
          </button>
        ))}
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/db83e637526e12ef9e75d8c580c56173caa7690ee32f4461831cd8f967854d07?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2"
          alt=""
          className="object-contain mt-4 w-full bg-blend-normal aspect-[250]"
        />
        <div className="self-start mt-4 ml-10 text-xs font-bold tracking-wide text-gray-900 bg-blend-normal max-md:ml-2.5">
          PAGES
        </div>
        {pageItems.map((item) => (
          <button
            key={item}
            className="px-8 py-2 mt-4 tracking-wide whitespace-nowrap bg-transparent text-left hover:bg-green-800 focus:outline-none"
          >
            {item}
          </button>
        ))}
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/187ce1dc121eadbaf2b164a1537b76addea408457aba1fbc961d7523220ecfd4?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2"
          alt=""
          className="object-contain mt-4 w-full bg-blend-normal aspect-[250]"
        />
        <button className="px-16 py-4 mt-4 tracking-wide whitespace-nowrap bg-transparent text-left hover:bg-green-800 focus:outline-none">
          Settings
        </button>
        <button className="self-center mt-4 tracking-wide text-gray-900 hover:text-green-400 focus:outline-none">
          Logout
        </button>
      </div>
    </div>
  );
};

// Prop validation error  ko remove kar ne ke liye hai
Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  closeSidebar: PropTypes.func.isRequired,
};

export default Sidebar;