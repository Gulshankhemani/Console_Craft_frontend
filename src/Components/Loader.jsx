import { useState, useEffect } from "react";

const Loader = () => {
  const [showText, setShowText] = useState(false); // This is used to toggle additional text
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
        const remainingSteps = totalSteps - Math.floor((oldProgress / 100) * totalSteps);
        const randomStep = Math.floor(Math.random() * (100 / remainingSteps)) + 1;

        return Math.min(oldProgress + randomStep, 100);
      });
    }, intervalDuration);

    const timer = setTimeout(() => {
      setShowText(true); // Show text after the animation
    }, animationDuration);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <div className="relative w-64 h-64 mb-8">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 10 L90 90 L10 90 Z"
            fill="none"
            stroke="#22c55e"
            strokeWidth="4"
            strokeDasharray="240"
            strokeDashoffset="240"
            className="animate-draw-triangle"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-bold text-green-500 opacity-0 animate-fade-in py-2">CC</span>
        </div>
      </div>
      <div className="text-green-500 text-2xl font-bold animate-pulse">
        {progress}%
      </div>
      {showText && (
        <div className="mt-4 text-white text-xl">
          Welcome to Cypher Club!
        </div>
      )}
    </div>
  );
};

export default Loader;
