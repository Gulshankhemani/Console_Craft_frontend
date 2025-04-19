import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;
    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;
    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;
    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => setTransformStyle("");

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle, transition: "transform 0.3s ease" }}
    >
      {children}
    </div>
  );
};

const BentoCard = ({ imageUrl, title, available, freeDate }) => {
  const freeStatus = available ? "now" : "soon";

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg bg-gray-800">
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => console.error("Image failed to load:", imageUrl, e)}
      />
      <div className="relative z-10 flex flex-col justify-between h-full p-4 text-white">
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm text-gray-300">{freeDate}</p>
        </div>
        <button
          className={`mt-2 px-4 py-2 rounded-full text-sm ${
            freeStatus === "now"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          {freeStatus === "now" ? "FREE NOW" : "COMING SOON"}
        </button>
      </div>
    </div>
  );
};

const FreeeGames = ({ sectioncategory = "Games" }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:8000/api/v1/image/getImageByCategory",
          {
            params: { category: sectioncategory, page: 1, limit: 12 },
          }
        );
        setImages(response.data.data || []);
      } catch (error) {
        console.error(
          "Error fetching images:",
          error.response?.data || error.message
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [sectioncategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-75"></div>
      </div>
    );
  }

  return (
    <section className="bg-black py-10">
      <div className="container mx-auto px-4 bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="mr-2">🎁</span> Free Games
          </h2>
          <button className="text-blue-400 hover:underline">View More</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <BentoTilt key={index} className="w-full h-[400px]">
              <Link to={`/game/${image._id}`}>
                <BentoCard
                  imageUrl={image.imageUrl}
                  available={image.available}
                />
              </Link>
            </BentoTilt>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreeeGames;
