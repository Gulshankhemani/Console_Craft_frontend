const Button = ({ name, containerClass = "", onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`btn ${containerClass} relative cursor-pointer overflow-hidden bg-blue-50 px-6 py-3 text-black flex items-center justify-center gap-1`}
    >
      <span>{name}</span>
    </button>
  );
};

export default Button;
