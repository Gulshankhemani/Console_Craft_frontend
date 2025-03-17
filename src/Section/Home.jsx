import Hero from "../Components/Hero.jsx";
import ProductCard from "../Components/ProductCard.jsx";

const Home = () => {
  return (
    <div>
      <Hero />
      <ProductCard
        image="path/to/image.jpg"
        title="Sample Game"
        price={59.99}
        rating={4}
        reviews={120}
      />
    </div>
  );
};

export default Home;