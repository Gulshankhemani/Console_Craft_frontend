import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PsOrder = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const imageRef = useRef(null);
  const navigate = useNavigate();

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
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
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

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    console.log("Token being sent:", token); // Debug: Check token

    if (!token) {
      setError("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    if (!product) {
      setError("Product details not loaded.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/cart/add",
        {
          productId: productId, // Use the productId from params
          quantity: 1,
          price: product.price, // Use the price from the fetched product
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("Add to Cart Response:", response.data);
      alert("Item added to cart successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item to cart.");
      console.error("Add to Cart Error:", err.response?.data || err.message);
    }
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
                  width: "600px",
                  height: "600px",
                  backgroundImage: `url(${product.imageUrl})`,
                  backgroundSize: "200%",
                  backgroundPosition: backgroundPosition,
                  backgroundColor: "black",
                  zIndex: 10,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
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
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
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
        </div>

        {/* Right Section: Purchase Options */}
        <div className="col-span-1 border border-blue-50/20 p-4 rounded-lg shadow">
          <p className="text-2xl font-bold text-blue-50">
            ₹{product.price.toLocaleString()}
          </p>
          <p className="text-green-500 mt-2">
            FREE delivery Thursday, 3 April. Order within 2 hrs 12 mins. Details
          </p>
          <p className="text-green-500 font-semibold mt-2">In stock</p>
          <button
            onClick={handleAddToCart}
            className="w-full bg-yellow-500 text-black py-2 rounded mt-4 hover:bg-yellow-600 transition"
          >
            Add to cart
          </button>
          <button className="w-full bg-orange-500 text-white py-2 rounded mt-2 hover:bg-orange-600 transition">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PsOrder;