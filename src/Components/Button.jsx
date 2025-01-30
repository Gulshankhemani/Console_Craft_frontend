import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const Button = ({ name, isBeam = false, containerclass = "", onClick }) => {
  const buttonRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current && textRef.current) {
      // Initially hide the text
      gsap.set(textRef.current, { opacity: 0 });

      // Animate the button and reveal the text
      gsap.fromTo(
        buttonRef.current,
        {
          width: "50px",
          height: "50px",
          borderRadius: "100%",
          backgroundColor: "#22c55e", // Ensures bg-green-500 is respected
        },
        {
          duration: 2,
          width: "auto",
          height: "50px",
          borderRadius: "8px",
          backgroundColor: "#22c55e", // Ensures bg-green-500 remains during animation
          ease: "power3.out",
          onComplete: () => {
            // Reveal the text after the animation
            gsap.to(textRef.current, { opacity: 1, duration: 0.5 });
          },
        }
      );
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`btn ${containerclass} relative bg-green-500 text-white px-6 py-3 text-lg shadow-lg flex items-center justify-center overflow-hidden`}
    >
      {isBeam && (
        <span className="relative flex h-3 w-3 mr-2">
          <span className="btn-ping bg-green-700 absolute inline-flex h-full w-full rounded-full opacity-75"></span>
          <span className="btn-ping_dot bg-green-700 relative inline-flex rounded-full h-3 w-3"></span>
        </span>
      )}
      <span ref={textRef}>{name}</span>
    </button>
  );
};

Button.propTypes = {
  name: PropTypes.string.isRequired, // name is required and must be a string
  isBeam: PropTypes.bool, // isBeam is optional and must be a boolean
  containerclass: PropTypes.string, // containerclass is optional and must be a string
  onClick: PropTypes.func, // onClick is optional and must be a function
};

export default Button;
