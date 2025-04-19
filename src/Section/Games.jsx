import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// BentoTilt component (unchanged)
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

// BentoCard component (unchanged)
const BentoCard = ({
  imageUrl,
  title,
  price,
  rating,
  reviews,
  productId,
  Available,
}) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();
    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  return (
    <div className="relative size-full">
      <img
        src={imageUrl}
        alt={title}
        className="absolute left-0 top-0 size-full object-cover object-center"
        onError={(e) => console.error("Image failed to load:", imageUrl, e)}
      />
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {price && (
            <p className="mt-2 text-sm font-bold text-blue-75">
              ₹{price.toLocaleString()}
            </p>
          )}
          {rating && reviews && (
            <p className="mt-1 text-xs text-yellow-500">
              {"★".repeat(Math.round(rating))}{" "}
              <span className="text-blue-75 opacity-70">({reviews})</span>
            </p>
          )}
        </div>

        {Available && (
          <div
            ref={hoverButtonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
          >
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
              }}
            />
            <p className="relative z-20">coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Games component (updated for button-controlled sliding)
const Games = ({ sectioncategory = "Games" }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [sectioncategory]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      const cardWidth = 300; // Width of each card
      const gap = 28; // Tailwind's space-x-7 (7 * 4px = 28px)
      const scrollDistance = (cardWidth + gap) * 3; // Scroll by 3 cards
      sliderRef.current.scrollBy({ left: -scrollDistance, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const cardWidth = 300; // Width of each card
      const gap = 28; // Tailwind's space-x-7 (7 * 4px = 28px)
      const scrollDistance = (cardWidth + gap) * 3; // Scroll by 3 cards
      sliderRef.current.scrollBy({ left: scrollDistance, behavior: "smooth" });
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
    <section className="bg-black pb-20">
      <div id="games" className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-32 relative">
          <h1 className="special-font hero-heading right-5 z-40 text-blue-75">
            <b>G</b>
            <b>a</b>mes
          </h1>
        </div>
        <div className="relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-50  text-black p-2 rounded-full z-10 hover:bg-opacity-75"
          >
            ←
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-50  text-black p-2 rounded-full z-10 hover:bg-opacity-75"
          >
            →
          </button>
          <div
            ref={sliderRef}
            className="flex overflow-x-hidden space-x-7 px-5 snap-x snap-mandatory"
            style={{
              scrollBehavior: "smooth",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {images.slice(1).map((image, index) => (
              <div
                key={image._id}
                className="flex-shrink-0 w-[300px] h-[400px] snap-start"
              >
                <BentoTilt className="bento-tilt_1 w-full h-full">
                  <Link to={`/game/${image._id}`}>
                    {index < 2 ? (
                      <BentoCard
                        imageUrl={image.imageUrl}
                        title={image.title}
                        reviews={image.reviews}
                        productId={image._id}
                      />
                    ) : (
                      <img
                        src={image.imageUrl}
                        alt={image.title || `Game ${index + 1}`}
                        className="size-full object-cover object-center"
                        onError={(e) =>
                          console.error(
                            "Image failed to load:",
                            image.imageUrl,
                            e
                          )
                        }
                      />
                    )}
                  </Link>
                </BentoTilt>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        div[ref="sliderRef"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Games;
