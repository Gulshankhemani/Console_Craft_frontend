
const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div>
            <h2 className="text-2xl font-bold">GameShop</h2>
            <p className="text-gray-400 mt-2">Your ultimate destination for gaming gear and accessories.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="/shop" className="text-gray-400 hover:text-white">Shop</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white">FAQs</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold">Follow Us</h3>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-gray-400 hover:text-white text-2xl"></a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl"></a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl"></a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl"></a>
              
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
          &copy; {new Date().getFullYear()} GameShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
