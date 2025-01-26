import { useState, useEffect } from "react";
import Button from "../Components/Button.jsx";
import ProductCard from "./ProductCard";
import game1 from "../Assets/game1.jpg";
import game2 from "../Assets/game2.jpg";
import game3 from "../Assets/game3.jpg";
import game4 from "../Assets/game4.jpg";
import game1_1 from "../Assets/game1_1.jpg";
import game1_2 from "../Assets/game1_2.jpg";
import game1_3 from "../Assets/game1_3.jpg";
import game1_4 from "../Assets/game1_4.jpg";
import game2_1 from "../Assets/game2_1.jpg";
import game2_2 from "../Assets/game2_2.jpg";
import game2_3 from "../Assets/game2_3.jpg";
import game2_4 from "../Assets/game2_4.jpg";
import game3_1 from "../Assets/game3_1.jpg";
import game3_2 from "../Assets/game3_2.jpg";
import game3_3 from "../Assets/game3_3.jpg";
import game3_4 from "../Assets/game3_4.jpg";
import game4_1 from "../Assets/game4_1.jpg";
import game4_2 from "../Assets/game4_2.jpg";
import game4_3 from "../Assets/game4_3.jpg";
import game4_4 from "../Assets/game4_4.jpg";

const Products = () => {
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const gameImages = [game1, game2, game3, game4];

  const galleryImagesMap = {
    [game1]: [game1_1, game1_2, game1_3, game1_4],
    [game2]: [game2_1, game2_2, game2_3, game2_4],
    [game3]: [game3_1, game3_2, game3_3, game3_4],
    [game4]: [game4_1, game4_2, game4_3, game4_4],
  };

  const currentGalleryImages =
    galleryImagesMap[gameImages[currentGameIndex]] || [];

  // Automatically change the game image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGameIndex((prevIndex) => (prevIndex + 1) % gameImages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [gameImages.length]);

  // Manual controls for next and previous slides
  const nextSlide = () => {
    setCurrentGameIndex((prevIndex) => (prevIndex + 1) % gameImages.length);
  };

  const prevSlide = () => {
    setCurrentGameIndex(
      (prevIndex) => (prevIndex - 1 + gameImages.length) % gameImages.length
    );
  };

  const products = [
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/e7d9645bf74b14273feee32ead6517b9b0b1e1b7d607dc36a918bdbb73b72f23?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2",
      title: "Apple Watch Series 4",
      price: "120.00",
      rating: 4,
      reviews: 131,
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/e7d9645bf74b14273feee32ead6517b9b0b1e1b7d607dc36a918bdbb73b72f23?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2",
      title: "Girl Handy Beg",
      price: "45.30",
      rating: 4,
      reviews: 34,
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/e7d9645bf74b14273feee32ead6517b9b0b1e1b7d607dc36a918bdbb73b72f23?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2",
      title: "Beats Headphone",
      price: "75.00",
      rating: 4,
      reviews: 52,
    },
  ];

  return (
    <div className="flex overflow-hidden flex-col bg-gradient-to-r from-black via-green-800 to-black w-full">
      <div className="w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="flex flex-col ml-5 w-full max-md:ml-0 max-md:w-full">
            <div className="flex flex-col w-full">
              <div className="flex flex-col px-7 mt-5 w-full max-md:px-5">
                <h1 className="self-start text-3xl font-bold tracking-normal text-green-300 hover:text-green-400">
                  Popular
                </h1>
                <div className="relative flex flex-wrap gap-10 items-center pr-10 max-md:pr-5 mt-6">
                  <div className="flex grow shrink self-stretch my-auto  h-[503px] min-w-[240px] w-[849px] relative">
                    <img
                      loading="lazy"
                      src={gameImages[currentGameIndex]}
                      alt="Game banner"
                      className="rounded-[20px] object-cover absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out"
                    />
                    {/* Navigation Buttons */}
                    <button
                      onClick={prevSlide}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-green-400 text-black rounded-full p-5 text-2xl opacity-70 hover:opacity-100"
                    >
                      &#8249; {/* Left Arrow */}
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-400 text-black rounded-full p-5 text-2xl opacity-70 hover:opacity-100"
                    >
                      &#8250; {/* Right Arrow */}
                    </button>
                  </div>
                  <div className="flex flex-col grow shrink self-stretch my-auto h-[475px] min-w-[240px] w-[500px] max-md:max-w-full  p-5">
                    <h1 className="self-start text-4xl font-black leading-relaxed text-center text-green-300 hover:text-green-400 ">
                      {currentGameIndex === 0 && "GTA"}
                      {currentGameIndex === 1 && "Resident Evil"}
                      {currentGameIndex === 2 && "Minecraft"}
                      {currentGameIndex === 3 && "Ghost of Tsushima"}
                    </h1>
                    <div className="flex flex-wrap gap-5 items-start mt-9 w-full max-md:max-w-full">
                      {currentGalleryImages.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="rounded-[20px] flex grow shrink bg-zinc-400 h-[154px] w-[164px] object-cover hover:shadow-[0px_30px_18px_-8px_rgba(0,0,0,0.1)] hover:scale-[1.04]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-center mt-5">
                    <Button name="Scroll Down For Your Dream" isBeam containerclass="w-auto" />
                  </div>
                </div>
                <div className="mt-8 max-md:max-w-full">
                  <div className="flex gap-5 max-md:flex-col">
                    {products.map((product, index) => (
                      <div
                        key={index}
                        className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full"
                      >
                        <ProductCard {...product} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products; 