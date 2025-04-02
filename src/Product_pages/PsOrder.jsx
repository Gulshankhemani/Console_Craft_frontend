import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PsOrder = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/v1/image/getImageById/${productId}`
        );
        const fetchedProduct = response.data.data;
        setProduct({
          imageUrl: fetchedProduct.imageUrl || "/images/fallback-product.jpg",
          title:
            fetchedProduct.title ||
            "Sony PS5™ Console Video Game Digital - Fortnite Bundle (Slim)",
          price: fetchedProduct.price || 44990,
          rating: fetchedProduct.rating || 4.4,
          reviews: fetchedProduct.reviews || "48",
        });
      } catch (err) {
        setError("Failed to load product details.");
        console.error("API Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  const handleMouseEnter = () => {
    setZoomStyle({ display: "block" });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-50"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <p className="text-blue-50">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 pt-20 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section: Product Image with Magnifier Effect */}
        <div className="col-span-1">
          <div className="relative">
            <div
              className="relative w-full h-auto"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img
                ref={imageRef}
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-auto object-contain rounded-lg"
              />
              <div
                className="absolute top-0 left-[calc(100%+1rem)] bg-black rounded-lg border border-blue-50/20"
                style={{
                  ...zoomStyle,
                  width: "500px", // Increased width
                  height: "500px", // Increased height
                  backgroundImage: `url(${product.imageUrl})`,
                  backgroundSize: "200%", // Adjust zoom level
                  backgroundPosition: backgroundPosition,
                  backgroundColor: "black", // Ensure solid background
                  zIndex: 10, // Ensure it appears above other elements
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)", // Optional shadow for better visibility
                }}
              />
            </div>
            <p className="text-xs text-blue-50 opacity-50 mt-2">
              Roll over image to zoom in
            </p>
          </div>
          <p className="text-xs text-blue-50 opacity-50 mt-2">
            © 2022 Sony Interactive Entertainment Inc. All Rights reserved.
            Design and specifications are subject to change without notice.
          </p>
        </div>

        {/* Middle Section: Product Details */}
        <div className="col-span-1">
          <h1 className="text-2xl font-bold text-blue-50">{product.title}</h1>
          <p className="text-blue-50 opacity-50">Platform: PlayStation 5</p>
          <div className="flex items-center mt-2">
            <div className="flex text-yellow-500">
              {[...Array(Math.round(product.rating))].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
              {[...Array(5 - Math.round(product.rating))].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 fill-current text-blue-50 opacity-20"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <p className="ml-2 text-blue-400">{product.rating} out of 5</p>
            <p className="ml-2 text-blue-400">{product.reviews} ratings</p>
            <p className="ml-2 text-blue-400">“playstation 5 console”</p>
          </div>
          <p className="text-blue-50 opacity-50 mt-1">
            Amazon's Choice for “playstation 5 console”
          </p>
          <p className="text-blue-50 opacity-50 mt-1">
            300+ bought in past month
          </p>
          <p className="text-2xl font-bold text-blue-50 mt-2">
            ₹{product.price.toLocaleString()}
          </p>
          <p className="text-sm text-blue-50 opacity-50">
            Inclusive of all taxes
          </p>
          <p className="text-sm text-blue-50 opacity-50">
            EMI starts at ₹2,181. No Cost EMI available{" "}
            <span className="text-blue-400">EMI options</span>
          </p>

          {/* Offers Section */}
          <div className="mt-4">
            <h3 className="font-semibold text-blue-50">Offers</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="border border-blue-50/20 p-2 rounded">
                <p className="font-semibold text-blue-50">Bank Offer</p>
                <p className="text-sm text-blue-50 opacity-50">
                  Upto ₹1,500.00 discount on select Credit Cards, Debit...
                </p>
                <p className="text-blue-400 text-sm">28 offers</p>
              </div>
              <div className="border border-blue-50/20 p-2 rounded">
                <p className="font-semibold text-blue-50">Cashback</p>
                <p className="text-sm text-blue-50 opacity-50">
                  Upto ₹1,349.00 cashback as Amazon Pay Balance when...
                </p>
                <p className="text-blue-400 text-sm">1 offer</p>
              </div>
              <div className="border border-blue-50/20 p-2 rounded">
                <p className="font-semibold text-blue-50">No Cost EMI</p>
                <p className="text-sm text-blue-50 opacity-50">
                  Upto ₹2,025.86 EMI interest savings on ICICI...
                </p>
                <p className="text-blue-400 text-sm">1 offer</p>
              </div>
              <div className="border border-blue-50/20 p-2 rounded">
                <p className="font-semibold text-blue-50">Partner Offers</p>
                <p className="text-sm text-blue-50 opacity-50">
                  Get GST invoice and save up to 28% on business purchases.
                </p>
                <p className="text-blue-400 text-sm">1 offer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Purchase Options */}
        <div className="col-span-1 border border-blue-50/20 p-4 rounded-lg shadow">
          <p className="text-2xl font-bold text-blue-50">
            ₹{product.price.toLocaleString()}
          </p>
          <p className="text-sm text-blue-50 opacity-50">/100 g</p>
          <p className="text-green-500 mt-2">
            FREE delivery Thursday, 3 April. Order within 2 hrs 12 mins. Details
          </p>
          <p className="text-sm mt-2 text-blue-50 opacity-50">
            Delivering to Jaipur 302012 -{" "}
            <span className="text-blue-400">Update location</span>
          </p>
          <p className="text-green-500 font-semibold mt-2">In stock</p>
          <p className="text-sm text-blue-50 opacity-50">Ships from Amazon</p>
          <p className="text-sm text-blue-50 opacity-50">
            Sold by Electronics Bazaar Store
          </p>
          <p className="text-sm text-blue-50 opacity-50">Secure transaction</p>
          <button className="w-full bg-yellow-500 text-black py-2 rounded mt-4">
            Add to cart
          </button>
          <button className="w-full bg-orange-500 text-white py-2 rounded mt-2">
            Buy Now
          </button>
          <div className="flex items-center mt-2">
            <input type="checkbox" className="mr-2" />
            <p className="text-sm text-blue-50 opacity-50">Add gift options</p>
          </div>
          <button className="w-full border border-blue-50/20 py-2 rounded mt-2 text-blue-400">
            Add to Wish List
          </button>
        </div>
      </div>

      {/* Bottom Section: Icons */}
      <div className="max-w-7xl mx-auto mt-6 flex justify-around">
        {[
          "Free Delivery",
          "Cash/Pay",
          "7 days Service Centre Replacement",
          "Top Brand",
          "Amazon Delivered",
          "Secure transaction",
        ].map((label) => (
          <div key={label} className="text-center">
            <p className="text-blue-50 opacity-50">{label}</p>
          </div>
        ))}
      </div>

      {/* About This Item */}
      <div className="max-w-7xl mx-auto mt-6">
        <h2 className="text-lg font-semibold text-blue-50">About this item</h2>
        <p className="text-blue-50 opacity-50 mt-2">
          • PlayStation 5 Experience lightning fast loading with an ultra-high
          speed SSD, deeper immersion with
        </p>
      </div>
    </div>
  );
};

export default PsOrder;
