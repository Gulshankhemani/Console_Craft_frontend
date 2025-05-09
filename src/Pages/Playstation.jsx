import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


const BentoProductCard = ({
  imageUrl,
  title,
  price,
  rating,
  reviews,
  productId,
  isSponsored = false,
}) => {
  return (
    <div className="relative bg-blue-75 rounded-lg shadow-md overflow-hidden border-hsla ">
      <div className="relative flex flex-row items-start h-auto w-auto p-4">
        <Link to={`/product/${productId}`}>
          <div className="w-80 h-48 mr-12">
            <img
              src={imageUrl || "/images/fallback-product.jpg"}
              alt={title}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </Link>
        <div className="flex flex-col justify-start flex-1 space-y-2">
          <Link to={`/product/${productId}`}>
            <h3 className="text-lg font-circular-web text-black special-font hover:text-blue-200">
              {title}
            </h3>
          </Link>
          <p className="text-base text-yellow-500 font-circular-web">
            {"★".repeat(Math.round(rating))}{" "}
            <span className="ml-1">({reviews})</span>
          </p>
          <p className="text-lg text-black opacity-50 font-circular-web">
            ₹{price}
          </p>
          <p className="text-base text-black opacity-50 font-circular-web">
            FREE delivery Wed, 2 Apr
          </p>
        </div>
        {isSponsored && (
          <span className="absolute top-2 right-2 text-sm text-white/20 bg-blue-75 px-2 py-1 rounded border-hsla">
            Sponsored
          </span>
        )}
      </div>
    </div>
  );
};

const Playstation = ({ sectioncategory = "PlayStation" }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 100000],
    platform: [],
    storage: [],
    ram: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/image/getImageByCategory`,
          {
            params: { category: sectioncategory, page: 1, limit: 10 },
          }
        );

        console.log("API Response:", response.data);
        const fetchedProducts = response.data.data || [];
        console.log("Fetched Products:", fetchedProducts);

        const formattedProducts = fetchedProducts.map((item, index) => ({
          id: item._id || `product-${index}`,
          image: item.imageUrl,
          name: item.title || `Product ${index + 1}`,
          price: item.price || 0,
          rating: item.rating || 4.0,
          reviews: item.reviews || "0",
          category: item.category || "",
          platform: item.platform || "",
          storage: item.storage || "",
          ram: item.ram || "",
          isSponsored: item.isSponsored || false,
        }));

        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      } catch (error) {
        console.error(
          "Error fetching products:",
          error.response?.data || error.message
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [sectioncategory]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterType === "priceRange") {
        updatedFilters.priceRange = value;
      } else {
        const currentValues = prevFilters[filterType];
        if (currentValues.includes(value)) {
          updatedFilters[filterType] = currentValues.filter((v) => v !== value);
        } else {
          updatedFilters[filterType] = [...currentValues, value];
        }
      }

      const filtered = products.filter((product) => {
        const matchesCategory =
          updatedFilters.category.length === 0 ||
          updatedFilters.category.includes(product.category);
        const matchesPrice =
          product.price >= updatedFilters.priceRange[0] &&
          product.price <= updatedFilters.priceRange[1];
        const matchesPlatform =
          updatedFilters.platform.length === 0 ||
          updatedFilters.platform.includes(product.platform);
        const matchesStorage =
          updatedFilters.storage.length === 0 ||
          (product.storage && updatedFilters.storage.includes(product.storage));
        const matchesRam =
          updatedFilters.ram.length === 0 ||
          (product.ram && updatedFilters.ram.includes(product.ram));

        return (
          matchesCategory &&
          matchesPrice &&
          matchesPlatform &&
          matchesStorage &&
          matchesRam
        );
      });

      setFilteredProducts(filtered);
      return updatedFilters;
    });
  };

  const handleAddToCart = (productId) => {
    console.log(`Added product ${productId} to cart`);
  };

  return (
    <div className="flex bg-blue-75 font-sans mt-15">
      {/* Filters Section (Regular Flow) */}
      <aside className="w-64 p-4 bg-blue-75 shadow-md border-hsla">
        <h2 className="text-xl font-bold mb-4 text-black font-circular-web">
          Filters
        </h2>

        <details open className="mb-4">
          <summary className="text-lg font-semibold cursor-pointer text-black font-circular-web">
            Category
          </summary>
          <div className="mt-2 space-y-2">
            {["Games", "PC Components", "PlayStation"].map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 accent-blue-50"
                  checked={filters.category.includes(category)}
                  onChange={() => handleFilterChange("category", category)}
                />
                <span className="text-sm text-black opacity-50 font-circular-web">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </details>

        <details open className="mb-4">
          <summary className="text-lg font-semibold cursor-pointer text-black font-circular-web">
            Price Range
          </summary>
          <div className="mt-2">
            <input
              type="range"
              min="0"
              max="100000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                handleFilterChange("priceRange", [
                  0,
                  parseInt(e.target.value),
                ])
              }
              className="w-full accent-blue-50"
            />
            <div className="flex justify-between text-xs text-black opacity-50 font-circular-web">
              <span>₹0</span>
              <span>₹{filters.priceRange[1]}</span>
            </div>
          </div>
        </details>

        <details open className="mb-4">
          <summary className="text-lg font-semibold cursor-pointer text-black font-circular-web">
            Platform
          </summary>
          <div className="mt-2 space-y-2">
            {["PC", "PS5", "PS4", "Xbox"].map((platform) => (
              <label key={platform} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 accent-blue-50"
                  checked={filters.platform.includes(platform)}
                  onChange={() => handleFilterChange("platform", platform)}
                />
                <span className="text-sm text-black opacity-50 font-circular-web">
                  {platform}
                </span>
              </label>
            ))}
          </div>
        </details>

        <details open className="mb-4">
          <summary className="text-lg font-semibold cursor-pointer text-black font-circular-web">
            Storage
          </summary>
          <div className="mt-2 space-y-2">
            {["64 GB", "128 GB", "256 GB", "512 GB", "1 TB"].map((storage) => (
              <label key={storage} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 accent-blue-50"
                  checked={filters.storage.includes(storage)}
                  onChange={() => handleFilterChange("storage", storage)}
                />
                <span className="text-sm text-black opacity-50 font-circular-web">
                  {storage}
                </span>
              </label>
            ))}
          </div>
        </details>

        <details open className="mb-4">
          <summary className="text-lg font-semibold cursor-pointer text-black font-circular-web">
            RAM Size
          </summary>
          <div className="mt-2 space-y-2">
            {["4 GB", "8 GB", "16 GB", "32 GB"].map((ram) => (
              <label key={ram} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 accent-blue-50"
                  checked={filters.ram.includes(ram)}
                  onChange={() => handleFilterChange("ram", ram)}
                />
                <span className="text-sm text-black opacity-50 font-circular-web">
                  {ram}
                </span>
              </label>
            ))}
          </div>
        </details>
      </aside>

      {/* Product Listing Section */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl bento-title special-font mb-6 text-black">
          Ga<b>m</b>i<b>n</b>g Co<b>n</b>soles
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-50"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {filteredProducts.map((product) => (
                <BentoProductCard
                  key={product.id}
                  imageUrl={product.image}
                  title={product.name}
                  price={product.price}
                  rating={product.rating}
                  reviews={product.reviews}
                  productId={product.id}
                  isSponsored={product.isSponsored}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Playstation;