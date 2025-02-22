import PropTypes from "prop-types";
import game1 from "../Assets/Game1/game1.jpg";
// import game2 from "../Assets/Game2/game2.jpg";
// import game3 from "../Assets/Game3/game3.jpg";


const ProductCard = ({ image, title, price, rating, reviews }) => {
  return (
    <div className="flex flex-col grow pb-6 w-full rounded-2xl border border-solid bg-gradient-to-r from-black via-green-800 to-black border-green-900 shadow-lg">
      <div className="flex relative flex-col justify-center px-3.5 py-36 w-full rounded-none aspect-[1.139] max-md:py-24">
        <img
          loading="lazy"
          src={game1}
          alt={title}
          className="object-cover absolute inset-0 size-full"
        />
        <div className="flex relative gap-5 justify-between -mb-7 max-md:mb-2.5">
          <button aria-label="Add to favorites" className="focus:outline-none">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/5b5735c5c21745d2a90d3d7eb96a4334ba429029a965da5210daa8fef74d7dc9?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2"
              alt=""
              className="object-contain shrink-0 aspect-square w-[41px] hover:opacity-80"
            />
          </button>
          <button aria-label="Share product" className="focus:outline-none">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/c3820febcb990cb6763f37a16a6d186867d4ee318aa8fbffc5f6a9e0d2797772?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2"
              alt=""
              className="object-contain shrink-0 aspect-square w-[41px] hover:opacity-80"
            />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-start px-6 mt-6 w-full max-md:pl-5">
        <div className="flex gap-5 justify-between self-stretch font-bold">
          <div className="flex flex-col">
            <div className="text-lg leading-none text-green-400">{title}</div>
            <div className="self-start mt-2 text-base leading-none text-green-300">
              ${price}
            </div>
          </div>
          <button aria-label="Product options" className="focus:outline-none">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3eaa35fb6038c03ead1fd08d495a2f60fb86b27dc277275b6950cb17f1e77942?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2"
              alt=""
              className="object-contain shrink-0 self-start w-11 aspect-square hover:opacity-80"
            />
          </button>
        </div>
        <div className="flex gap-1 mt-2">
          <div className="flex gap-0.5 my-auto">
            {[...Array(rating)].map((_, index) => (
              <img
                key={index}
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/643f4d09786c2ad0ce66c5154de844048d13c6572825ca2be0a92be7c4d37811?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2"
                alt=""
                className="object-contain shrink-0 w-4 aspect-[1.14]"
              />
            ))}
            {[...Array(5 - rating)].map((_, index) => (
              <img
                key={`empty-${index}`}
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/278f832e16ff2cefa527fbf7c5e6f0b26354eaea2170ec04bb1c714efc2cc836?placeholderIfAbsent=true&apiKey=3a9eed2ab9b94807b0368b782b883ee2"
                alt=""
                className="object-contain shrink-0 w-4 bg-blend-normal aspect-[1.14]"
              />
            ))}
          </div>
          <div className="text-sm font-semibold tracking-normal text-green-400 bg-blend-normal">
            ({reviews})
          </div>
        </div>
        <button className="px-6 py-1.5 mt-5 text-sm font-bold leading-7 text-green-400 rounded-xl bg-gradient-to-r from-green-700 via-green-800 to-green-700 max-md:px-5 focus:outline-none hover:bg-gradient-to-r hover:from-green-600 hover:via-green-700 hover:to-green-600">
          Edit Product
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
  reviews: PropTypes.number.isRequired,
};

export default ProductCard; 