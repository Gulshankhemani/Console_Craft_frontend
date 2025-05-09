import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "../Components/Button.jsx";

const GameOrder = ({ sectioncategory = "Games" }) => {
  const [images, setImages] = useState([]);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  const previewImages = [
    product?.imageUrl || "/images/fallback-game.jpg",
    "/images/fallback-game2.jpg",
    "/images/fallback-game3.jpg",
    "/images/fallback-game4.jpg",
  ];

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/image/getImageByCategory`,
          {
            params: { category: sectioncategory, page: 1, limit: 14 },
          }
        );
        const fetchedImages = response.data.data || [];
        setImages(fetchedImages);
      } catch (error) {
        console.error(
          "Error fetching related games:",
          error.response?.data || error.message
        );
        setError("Failed to load related games.");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [sectioncategory]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log("Fetching product with ID:", productId);
        const response = await axios.get(
           `${import.meta.env.VITE_API_BASE_URL}/api/v1/image/getImageById/${productId}`
        );
        console.log("API Response:", response.data);
        const fetchedProduct = response.data.data;
        if (!fetchedProduct) {
          throw new Error("No product data returned");
        }
        setProduct({
          imageUrl: fetchedProduct.imageUrl || "/images/fallback-game.jpg",
         
          price: fetchedProduct.price || 2999,
          rating: fetchedProduct.rating || 4.0,
          reviews: fetchedProduct.reviews || "50",
          platform: fetchedProduct.platform || "PS5",
          category: fetchedProduct.category || "Games",
          storage: fetchedProduct.storage || "0 GB",
          ram: fetchedProduct.ram || "0 GB",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load game details.");
        console.error("API Error:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
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

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    console.log("Token being sent:", token);
    if (!token) {
      setError("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    if (!product) {
      setError("Game details not loaded.");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/cart`,
        {
          productId: productId,
          quantity: 1,
          price: product.price,
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
      alert("Game added to cart successfully!");
      navigate("/cart");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add game to cart.");
      console.error("Add to Cart Error:", err.response?.data || err.message);
    }
  };

  const handleBuyNow = async () => {
    if (loading || !product || paymentProcessing) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to proceed with payment.");
      navigate("/login");
      return;
    }

    try {
      setPaymentProcessing(true);

      // Step 1: Create a Razorpay order
      const orderResponse = await axios.post(
       `${import.meta.env.VITE_API_BASE_URL}/api/v1/payment/create-order`,
        { amount: product.price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const { id: orderId, amount } = orderResponse.data.data;

      // Step 2: Get user info for prefilling
      const userEmail = localStorage.getItem("userEmail") || "";
      const userPhone = localStorage.getItem("userPhone") || "";
      const userName = localStorage.getItem("userName") || "";

      // Step 3: Initialize Razorpay checkout
      const options = {
        key: "rzp_test_RhtYF7tlln3tsk",
        amount: amount,
        currency: "INR",
        name: "Console - craft",
        description: `Payment for ${product.title}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment on server
            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/v1/payment/verify-payment`,
              paymentData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );

            console.log("Payment Success:", verifyResponse.data);
            alert("Payment successful! Order has been placed.");
            navigate("/order-confirmation"); // Redirect to a confirmation page
          } catch (err) {
            console.error("Payment Verification Error:", err);
            setError("Payment verification failed. Please contact support.");
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            setPaymentProcessing(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error("Payment Error:", err.response || err.message);
      setError(err.response?.data?.message || "Failed to process payment");
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-75"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <p className="text-blue-75">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 pt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.5fr,1.5fr,1.5fr] gap-6">
        <div className="col-span-1 flex flex-col gap-4">
          {previewImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${product.title} preview ${index + 1}`}
              className={`w-[170px] h-[95px] object-cover rounded-lg border border-gray-200 cursor-pointer ${
                selectedImageIndex === index ? "border-blue-75" : ""
              }`}
              onClick={() => setSelectedImageIndex(index)}
            />
          ))}
        </div>
        <div className="col-span-1 relative">
          <div
            className="relative w-full h-auto"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              ref={imageRef}
              src={previewImages[selectedImageIndex]}
              alt={product.title}
              className="w-full h-auto object-contain rounded-lg"
            />
            <div
              className="absolute top-0 left-[calc(100%+1rem)] bg-black rounded-lg border border-gray-200/20"
              style={{
                ...zoomStyle,
                width: "600px",
                height: "337px",
                backgroundImage: `url(${previewImages[selectedImageIndex]})`,
                backgroundSize: "200%",
                backgroundPosition: backgroundPosition,
                backgroundColor: "black",
                zIndex: 10,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
              }}
            />
          </div>
          <p className="text-xs text-blue-75 opacity-50 mt-2 font-robert-regular">
            Roll over image to zoom in
          </p>
          <p className="text-xs text-blue-75 opacity-50 mt-2 font-robert-regular">
            © 2025 Game Publisher. All rights reserved.
            Specifications are subject to change without notice.
          </p>
        </div>
        <div className="col-span-1 border border-gray-800 p-6 rounded-lg shadow-md bg-gray-900">
          <h1 className="text-2xl font-bold text-blue-75 mb-3 leading-tight">
            {product.title}
          </h1>
          <p className="text-sm text-blue-75 opacity-70 mb-3 font-robert-regular">
            Platform: {product.platform}
          </p>
          <div className="flex items-center mb-3">
            <div className="flex space-x-1">
              {[...Array(Math.round(product.rating))].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 fill-current text-yellow-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
              {[...Array(5 - Math.round(product.rating))].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 fill-current text-blue-75 opacity-30"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <p className="ml-2 text-sm text-blue-75 font-robert-regular">
              {product.rating} out of 5
            </p>
            <p className="ml-2 text-sm text-blue-75 opacity-70 font-robert-regular">
              ({product.reviews} ratings)
            </p>
          </div>
          <p className="text-sm text-blue-75 opacity-70 mb-2 font-robert-regular">
            Popular in {product.category}
          </p>
          <p className="text-sm text-blue-75 opacity-70 mb-4 font-robert-regular">
            500+ bought in past month
          </p>
          <p className="text-3xl font-bold text-blue-75 mb-2 font-robert-regular">
            ₹{product.price.toLocaleString()}
          </p>
          <p className="text-xs text-blue-75 opacity-70 mb-2 font-robert-regular">
            Inclusive of all taxes
          </p>
          <p className="text-xs text-blue-75 opacity-70 mb-4 font-robert-regular">
            EMI starts at ₹{(product.price / 12).toFixed(0)}. No Cost EMI available{" "}
            <span className="text-blue-75 underline">EMI options</span>
          </p>
          <div className="mb-6">
            <p className="text-sm text-green-600 mb-2 font-robert-regular">
              FREE digital delivery within 24 hours.{" "}
              <span className="text-blue-75 opacity-70 underline">Details</span>
            </p>
            <p className="text-sm text-green-600 font-semibold font-robert-regular">
              Available Now
            </p>
          </div>
          <Button
            name="Add to Cart"
            containerClass="w-full px-6 py-2 rounded-md mb-3 border border-gray-800 bg-blue-75 text-black"
            onClick={handleAddToCart}
            disabled={loading || paymentProcessing}
          />
          <Button
            name={paymentProcessing ? "Processing..." : "Buy Now"}
            containerClass="w-full px-6 py-2 rounded-md border border-gray-800 bg-blue-75 text-black"
            onClick={handleBuyNow}
            disabled={loading || paymentProcessing}
          />
        </div>
      </div>
      <div id="related-games" className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-10 relative">
          <p className="mb-5 max-w-64 font-robert-regular text-blue-75 text-xl font-bold">
            Related Games
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.slice(1, 5).map((image, index) => (
              <Link
                key={index}
                to={`/game/${image._id}`}
                className="block relative overflow-hidden rounded-lg bg-gray-900 hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={image.imageUrl || "/images/fallback-game.jpg"}
                  alt={`Related Game ${index + 1}`}
                  className="w-full h-48 object-cover"
                  onError={(e) =>
                    console.error("Image failed to load:", image.imageUrl, e)
                  }
                />
                <div className="p-2 text-center">
                  <p className="text-sm font-medium text-blue-75">
                    { `Related Game ${index + 1}`}
                  </p>
                  <p className="text-xs text-yellow-500">
                    {"★".repeat(Math.round(image.rating || 4.0))}{" "}
                    <span className="text-blue-75 opacity-70">
                      ({image.reviews || "0"})
                    </span>
                  </p>
                  <p className="text-sm text-blue-75 opacity-50 line-through">
                    ₹{(image.price || 2999) + 500}
                  </p>
                  <p className="text-sm font-bold text-blue-75">
                    ₹{image.price || 2999}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOrder;