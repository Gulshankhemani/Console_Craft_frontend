import React, { useState, useEffect, useRef } from "react";
import axios from "axios";


// BentoTilt component (unchanged)
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

// BentoCard component (modified to use images)
const BentoCard = ({ imageUrl, title, description, Available }) => {
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
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
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

// Games component (modified to fetch images)
const Games = ({ sectioncategory = "Games" }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
  },[sectioncategory]);

  if (isLoading) {
    return <div>Loading features...</div>;
  }

  return (
    <section className="bg-black pb-52">
      <div id="games" className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-32 relative">
          <h1 className="special-font hero-heading right-5 z-40 text-blue-75">
            <b>G</b><b>a</b>mes
          </h1>
        </div>
        <div className="grid h-[135vh] w-full grid-cols-3 grid-row gap-7">
          <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
            <BentoCard
              imageUrl={images[1]?.imageUrl}
            />
          </BentoTilt>
          <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
            <BentoCard
              imageUrl={images[2]?.imageUrl}
            />
          </BentoTilt>
          <BentoTilt className="bento-tilt_2">
            <img
              src={images[3]?.imageUrl}
              alt="Feature image"
              className="size-full object-cover object-center"
              onError={(e) => console.error("Image failed to load:", images[3]?.imageUrl, e)}
            />
          </BentoTilt>
          <BentoTilt className="bento-tilt_2">
            <img
              src={images[4]?.imageUrl}
              alt="Feature image"
              className="size-full object-cover object-center"
              onError={(e) => console.error("Image failed to load:", images[3]?.imageUrl, e)}
            />
          </BentoTilt>
          <BentoTilt className="bento-tilt_2">
            <img
              src={images[5]?.imageUrl}
              alt="Feature image"
              className="size-full object-cover object-center"
              onError={(e) => console.error("Image failed to load:", images[3]?.imageUrl, e)}
            />
          </BentoTilt>
          <BentoTilt className="bento-tilt_2">
            <img
              src={images[6]?.imageUrl}
              alt="Feature image"
              className="size-full object-cover object-center"
              onError={(e) => console.error("Image failed to load:", images[3]?.imageUrl, e)}
            />
          </BentoTilt>
          <BentoTilt className="bento-tilt_2">
            <img
              src={images[7]?.imageUrl}
              alt="Feature image"
              className="size-full object-cover object-center"
              onError={(e) => console.error("Image failed to load:", images[3]?.imageUrl, e)}
            />
          </BentoTilt>
          <BentoTilt className="bento-tilt_2">
            <img
              src={images[8]?.imageUrl}
              alt="Feature image"
              className="size-full object-cover object-center"
              onError={(e) => console.error("Image failed to load:", images[3]?.imageUrl, e)}
            />
          </BentoTilt>
          <BentoTilt className="bento-tilt_2">
            <img
              src={images[9]?.imageUrl}
              alt="Feature image"
              className="size-full object-cover object-center"
              onError={(e) => console.error("Image failed to load:", images[3]?.imageUrl, e)}
            />
          </BentoTilt>
          <BentoTilt className="bento-tilt_2">
            <img
              src={images[10]?.imageUrl}
              alt="Feature image"
              className="size-full object-cover object-center"
              onError={(e) => console.error("Image failed to load:", images[3]?.imageUrl, e)}
            />
          </BentoTilt>
          <BentoTilt className="bento-tilt_2">
            <img
              src={images[11]?.imageUrl}
              alt="Feature image"
              className="size-full object-cover object-center"
              onError={(e) => console.error("Image failed to load:", images[3]?.imageUrl, e)}
            />
          </BentoTilt>
          <BentoTilt className="bento-tilt_2">
            <img
              src={images[12]?.imageUrl}
              alt="Feature image"
              className="size-full object-cover object-center"
              onError={(e) => console.error("Image failed to load:", images[3]?.imageUrl, e)}
            />
          </BentoTilt>
        </div>
      </div>
    </section>
  );
};

export default Games;