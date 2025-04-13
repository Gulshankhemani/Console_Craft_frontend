import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Added Link
import axios from "axios";
import Button from "../Components/Button.jsx";

const PsOrder = ({ sectioncategory = "PlayStation" }) => {
  const [images, setImages] = useState([]);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  const previewImages = [
    product?.imageUrl || "/images/fallback-product.jpg",
    "/images/fallback-product2.jpg",
    "/images/fallback-product3.jpg",
    "/images/fallback-product4.jpg",
  ];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/v1/image/getImageByCategory",
          {
            params: { category: sectioncategory, page: 1, limit: 14 },
          }
        );
        const fetchedImages = response.data.data || [];
        setImages(fetchedImages);
      } catch (error) {
        console.error(
          "Error fetching images:",
          error.response?.data || error.message
        );
        setError("Failed to load related images.");
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

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    console.log("Token being sent:", token);

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
        "http://localhost:8000/api/v1/cart",
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
      alert("Item added to cart successfully!");
      navigate("/cart");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item to cart.");
      console.error("Add to Cart Error:", err.response?.data || err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <p className="text-black">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-75 p-4 pt-24 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.5fr,1.5fr,1.5fr] gap-6">
        {/* Preview Gallery */}
        <div className=" col-span-1 flex flex-col gap-4">
          {previewImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${product.title} preview ${index + 1}`}
              className={`w-[170px] h-[138px] object-cover rounded-lg border border-gray-200 cursor-pointer ${
                selectedImageIndex === index ? "border-black" : ""
              }`}
              onClick={() => setSelectedImageIndex(index)}
            />
          ))}
        </div>

        {/* Enlarged Main Image */}
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
                height: "600px",
                backgroundImage: `url(${previewImages[selectedImageIndex]})`,
                backgroundSize: "200%",
                backgroundPosition: backgroundPosition,
                backgroundColor: "black",
                zIndex: 10,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
              }}
            />
          </div>
          <p className="text-xs text-black opacity-50 mt-2 font-robert-regular">
            Roll over image to zoom in
          </p>
          <p className="text-xs text-black opacity-50 mt-2 font-robert-regular">
            © 2022 Sony Interactive Entertainment Inc. All Rights reserved.
            Design and specifications are subject to change without notice.
          </p>
        </div>

        {/* Product Details */}
        <div className="col-span-1 border border-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-black mb-3 leading-tight">
            {product.title}
          </h1>
          <p className="text-sm text-black opacity-70 mb-3 font-robert-regular">
            Platform: PlayStation 5
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
                  className="w-5 h-5 fill-current text-black opacity-30"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <p className="ml-2 text-sm text-black font-robert-regular">
              {product.rating} out of 5
            </p>
            <p className="ml-2 text-sm text-black opacity-70 font-robert-regular">
              ({product.reviews} ratings)
            </p>
          </div>
          <p className="text-sm text-black opacity-70 mb-2 font-robert-regular">
            Amazon's Choice for “playstation 5 console”
          </p>
          <p className="text-sm text-black opacity-70 mb-4 font-robert-regular">
            300+ bought in past month
          </p>
          <p className="text-3xl font-bold text-black mb-2 font-robert-regular">
            ₹{product.price.toLocaleString()}
          </p>
          <p className="text-xs text-black opacity-70 mb-2 font-robert-regular">
            Inclusive of all taxes
          </p>
          <p className="text-xs text-black opacity-70 mb-4 font-robert-regular">
            EMI starts at ₹2,181. No Cost EMI available{" "}
            <span className="text-black underline">EMI options</span>
          </p>
          <div className="mb-6">
            <p className="text-sm text-green-600 mb-2 font-robert-regular">
              FREE delivery Thursday, 3 April. Order within 2 hrs 12 mins.{" "}
              <span className="text-black opacity-70 underline">Details</span>
            </p>
            <p className="text-sm text-green-600 font-semibold font-robert-regular">
              In Stock
            </p>
          </div>
          <Button
            name="Add to Cart"
            containerClass="w-full px-6 py-2 rounded-md mb-3 border border-gray-800"
            onClick={handleAddToCart}
          />
          <Button
            name="Buy Now"
            containerClass="w-full px-6 py-2 rounded-md border border-gray-800"
            onClick={() => console.log("Buy Now clicked")}
          />
        </div>
      </div>

      {/* Related Items Section */}
      <div id="related-items" className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-10 relative">
          <p className="mb-5 max-w-64 font-robert-regular text-black text-xl font-bold">
            Related Items
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.slice(1, 5).map((image, index) => (
              <Link
                key={index}
                to={`/product/${image._id}`} // Assuming _id is the product ID from the API
                className="block relative overflow-hidden rounded-lg bg-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={image.imageUrl || "/images/fallback-product.jpg"}
                  alt={image.title || `Related Item ${index + 1}`}
                  className="w-full h-48 object-cover"
                  onError={(e) =>
                    console.error("Image failed to load:", image.imageUrl, e)
                  }
                />
                <div className="p-2 text-center">
                  <p className="text-sm font-medium text-black">
                    {image.title || `Related Item ${index + 1}`}
                  </p>
                  <p className="text-xs text-yellow-500">
                    {"★".repeat(Math.round(image.rating || 4.0))}{" "}
                    <span className="text-black opacity-70">
                      ({image.reviews || "0"})
                    </span>
                  </p>
                  <p className="text-sm text-black opacity-50 line-through">
                    ₹{(image.price || 100) + 50}
                  </p>
                  <p className="text-sm font-bold text-black">
                    ₹{image.price || 100}
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

export default PsOrder;