import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;
    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
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

const BentoCard = ({ imageUrl }) => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-800">
      <img
        src={imageUrl}
        className="absolute inset-0 w-full h-full object-contain"
        onError={(e) => console.error("Image failed to load:", imageUrl, e)}
      />
    </div>
  );
};

const FreeeGames = ({ sectioncategory = "Games" }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/image/getImageByCategory`,
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

  useEffect(() => {
    const checkScroll = () => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    const slider = sliderRef.current;
    slider?.addEventListener("scroll", checkScroll);
    checkScroll(); // Initial check
    return () => slider?.removeEventListener("scroll", checkScroll);
  }, [images]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      const cardWidth = 400; 
      const gap = 32; // Tailwind's space-x-8 (8 * 4px = 32px)
      const scrollDistance = (cardWidth + gap) * 3; // Scroll by 3 cards
      sliderRef.current.scrollBy({ left: -scrollDistance, behavior: "smooth" });
      console.log("Scrolling left by", scrollDistance);
    } else {
      console.error("sliderRef is not defined");
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const cardWidth = 400;
      const gap = 32;
      const scrollDistance = (cardWidth + gap) * 3; 
      sliderRef.current.scrollBy({ left: scrollDistance, behavior: "smooth" });
      console.log("Scrolling right by", scrollDistance);
    } else {
      console.error("sliderRef is not defined");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-75"></div>
      </div>
    );
  }

  return (
    <section className="bg-black py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl special-font hero-heading text-white flex items-center">
            <b>F</b>ree G<b>a</b>mes
          </h1>
        </div>
        <div className="bg-gray-900 rounded-2xl p-8 shadow-lg relative">
          <button
            type="button"
            onClick={scrollLeft}
            className={`btn absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-50 text-black p-5 rounded-full z-50 shadow-md hover:bg-blue-200 transition ${
              !canScrollLeft && "opacity-50 cursor-not-allowed"
            }`}
            aria-label="Scroll Left"
            disabled={!canScrollLeft}
          >
            ←
          </button>
          <button
            type="button"
            onClick={scrollRight}
            className={`btn absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-50 text-black p-5 rounded-full z-50 shadow-md hover:bg-blue-200 transition ${
              !canScrollRight && "opacity-50 cursor-not-allowed"
            }`}
            aria-label="Scroll Right"
            disabled={!canScrollRight}
          >
            →
          </button>
          <div className="relative">
            <div
              ref={sliderRef}
              className="flex overflow-x-auto space-x-8 snap-x snap-mandatory"
              style={{
                scrollBehavior: "smooth",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[400px] h-[225px] snap-start"
                >
                  <BentoTilt className="w-full h-full">
                    <Link to={`/game/${image._id}`}>
                      <BentoCard
                        imageUrl={image.imageUrl}
                        title={image.title}
                        available={image.available}
                        freeDate={image.freeDate}
                      />
                    </Link>
                  </BentoTilt>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .flex.overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FreeeGames;