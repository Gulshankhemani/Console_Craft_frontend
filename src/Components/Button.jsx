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
          
        },
        {
          duration: 2,
          width: "auto",
          height: "50px",
          borderRadius: "8px",
          
          ease: "power3.out",
          onComplete: () => {
            gsap.to(buttonRef.current, { backgroundColor: "#8f55ed", duration: 0.2 }); // Set to white after animation
            gsap.to(textRef.current, { opacity: 1, duration: 0.5 });
          }          
        }
      );
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`btn ${containerclass} w-8 flex-col self-stretch focus:outline-none relative px-6 py-3 text-lg shadow-lg flex items-center justify-center overflow-hidden`}
    >
      {isBeam && (
        <span className="relative flex h-3 w-3 mr-2">
          <span className="btn-ping"></span>
          <span className="btn-ping_dot"></span>
        </span>
      )}
      <span ref={textRef}>{name}</span>
    </button>
  );
};

Button.propTypes = {
  name: PropTypes.string.isRequired,
  isBeam: PropTypes.bool,
  containerclass: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
// <Button
// name="Scroll Down For Your Dream"
// isBeam
// containerclass="w-auto"
// />