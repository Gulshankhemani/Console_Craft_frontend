import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Navbars from "../Section/Navbar.jsx";
import Hero from "../Section/Hero.jsx";
import Overview from "../Section/Overview.jsx";
import Login from "../NavPages/Login.jsx";
import Deals from "../NavPages/Deals.jsx";
import Signin from "../Components/Signin.jsx";
import Footer from "../Section/Footer.jsx";
import Loader from "../Components/Loader.jsx";
import Contact from "../NavPages/Contact.jsx";
import Gift_Card from "../NavPages/Gift_Card.jsx";
import Feature from "../Section/Features.jsx";
import Playstation from "../Pages/Playstation.jsx";
import PsOrder from "../Product_pages/PsOrder.jsx";

const Page_Component = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("hasLoadedBefore", "true");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Navbars />
      {isLoading ? <Loader /> : <div>{children}</div>}
      <Footer />
    </div>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <Page_Component>
            <Hero />
            <Overview />
            <Feature />
          </Page_Component>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/gift_card" element={<Gift_Card />} />
      <Route path="/deals" element={<Deals />} />
      <Route path="/signin" element={<Signin />} />
      <Route
        path="/playstation"
        element={
          <Page_Component>
            <Playstation />
          </Page_Component>
        }
      />
      <Route path="/product/:productId" element={<PsOrder />} />
    </>
  )
);

export default router;
