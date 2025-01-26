import PropTypes from "prop-types";

const Button = ({ name, isBeam = false, containerclass = "", onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`btn ${containerclass} relative bg-green-500 text-black px-6 py-3 text-lg shadow-lg hover:bg-green-600 flex items-center justify-center`}>
      {isBeam && (
        <span className="relative flex h-3 w-3 mr-2">
          <span className="btn-ping bg-green-700 absolute inline-flex h-full w-full rounded-full opacity-75"></span>
          <span className="btn-ping_dot bg-green-700 relative inline-flex rounded-full h-3 w-3"></span>
        </span>
      )}
      {name}
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
