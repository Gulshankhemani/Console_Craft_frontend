import { useState, useEffect } from "react";
import logo from "../Assets/logo.png";

const Loader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const animationDuration = 2000; // Duration of the logo animation in milliseconds
    const intervalDuration = 100; // Interval between progress updates in milliseconds
    const totalSteps = Math.ceil(animationDuration / intervalDuration);

    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Generate a random laggy step ensuring it fits within the total animation duration
        const remainingSteps =
          totalSteps - Math.floor((oldProgress / 100) * totalSteps);
        const randomStep =
          Math.floor(Math.random() * (100 / remainingSteps)) + 1;

        return Math.min(oldProgress + randomStep, 100);
      });
    }, intervalDuration);

    const timer = setTimeout(() => {}, animationDuration);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900">
      <div className="relative w-64 h-64 mb-8">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                style={{ stopColor: "#FF0000", stopOpacity: 1 }}
              />
              <stop
                offset="12.5%"
                style={{ stopColor: "#ff7300", stopOpacity: 1 }}
              />
              <stop
                offset="25%"
                style={{ stopColor: "#fffb00", stopOpacity: 1 }}
              />
              <stop
                offset="37.5%"
                style={{ stopColor: "#48ff00", stopOpacity: 1 }}
              />
              <stop
                offset="50%"
                style={{ stopColor: "#00ffd5", stopOpacity: 1 }}
              />
              <stop
                offset="62.5%"
                style={{ stopColor: "#002bff", stopOpacity: 1 }}
              />
              <stop
                offset="75%"
                style={{ stopColor: "#ff00c8", stopOpacity: 1 }}
              />
              <stop
                offset="87.5%"
                style={{ stopColor: "#ff0000", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
          <path
            d="M50 10 L90 90 L10 90 Z"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeDasharray="240"
            strokeDashoffset="240"
            className="animate-draw-triangle"
          />
        </svg>
        =
      </div>
      <div className="text-green-500 text-2xl font-bold animate-pulse">
        {progress}%
      </div>
    </div>
  );
};

export default Loader;
