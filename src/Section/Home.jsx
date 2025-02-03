import { useState, useEffect } from "react";
import Products from "../Components/Products.jsx";
import Loader from "../components/Loader";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Show loader for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>

      {isLoading && <Loader />}
      {!isLoading && <Products />}
    </div>
  );
};

export default Home;
