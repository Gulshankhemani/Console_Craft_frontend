import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import axios from "axios";
import VideoPreview from "../Components/VideoPreview";

gsap.registerPlugin(ScrollTrigger);

const Hero = ({ sectionTitle = "hero" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const nextVideoRef = useRef(null);
  const mainVideoRef = useRef(null);

  const titles = [
    "Play Station",
    "Laptop",
    "Nintendo Switch",
    "Ghost of Tsushima",
    "Black-Myth Wukong",
    "GTA6",
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/videos/getVideoByTitle`,
          {
            params: { title: sectionTitle, page: 1, limit: 6 },
          }
        );
        const fetchedVideos = response.data.data || [];
        setVideos(fetchedVideos);
      } catch (error) {
        console.error(
          "Error fetching videos:",
          error.response?.data || error.message
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [sectionTitle]);

  useEffect(() => {
    if (mainVideoRef.current) {
      const handleVideoEnd = () => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
      };
      const videoEl = mainVideoRef.current;
      videoEl.addEventListener("ended", handleVideoEnd);
      return () => {
        videoEl.removeEventListener("ended", handleVideoEnd);
      };
    }
  }, [videos, currentIndex]);

  const totalVideos = videos.length;
  const upcomingVideoIndex = (currentIndex + 1) % totalVideos || 0;

  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurrentIndex(upcomingVideoIndex);
  };

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVideoRef.current.play(),
        });
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    }
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  const splitAndFormatTitle = (title) => {
    const words = title.split(" ");
    let firstPart = "redefine";
    let secondPart = "Gaming";

    if (words.length > 1) {
      firstPart = words[0];
      secondPart = words.slice(1).join(" ");
    } else {
      firstPart = words[0];
    }

    const formatWord = (word) =>
      word.split("").map((char, index) => {
        if (char.toLowerCase() === "a" || char.toLowerCase() === "n") {
          return <b key={index}>{char}</b>;
        }
        return char;
      });

    return {
      first: formatWord(firstPart),
      second: formatWord(secondPart),
    };
  };

  const currentTitleParts = splitAndFormatTitle(titles[currentIndex] || "redefine Gaming");

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      <div
        id="video-frame"
        className="relative h-dvh z-10 w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div>
          <div className="mask-clip-path absolute absolute-center z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <VideoPreview>
              <div
                onClick={handleMiniVdClick}
                className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
              >
                <video
                  ref={nextVideoRef}
                  src={videos[upcomingVideoIndex]?.videoUrl}
                  loop
                  muted
                  id="current-video"
                  className="size-64 origin-center scale-150 object-cover object-center"
                  onError={(e) =>
                    console.error(
                      "Mini video failed to load:",
                      videos[upcomingVideoIndex]?.videoUrl,
                      e
                    )
                  }
                />
              </div>
            </VideoPreview>
          </div>
          <video
            ref={nextVideoRef}
            src={videos[currentIndex]?.videoUrl}
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onError={(e) =>
              console.error(
                "Next video failed to load:",
                videos[currentIndex]?.videoUrl,
                e
              )
            }
          />
          <video
            ref={mainVideoRef}
            src={videos[currentIndex]?.videoUrl}
            autoPlay
            loop={false}
            muted
            playsInline
            className="absolute left-0 top-0 size-full object-cover object-center"
            onError={(e) =>
              console.error(
                "Main video failed to load:",
                videos[currentIndex]?.videoUrl,
                e
              )
            }
          />
        </div>
        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          {currentTitleParts.second}
        </h1>
        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              {currentTitleParts.first}
            </h1>
            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter in your Dream world
            </p>
          </div>
        </div>
      </div>
      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        {currentTitleParts.second}
      </h1>
    </div>
  );
};

export default Hero;
