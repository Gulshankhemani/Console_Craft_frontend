import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Headers from "../Section/Header.jsx";
import Home from "../Section/Home.jsx";
import Language from "../NavPages/Language.jsx";
import Login from "../NavPages/Login.jsx";
import Return_order from "../NavPages/Return_order.jsx";
import PropTypes from "prop-types";
import Signin from "../Components/Signin.jsx";
import Footer from "../Section/Footer.jsx";
import Loader from "../Components/Loader.jsx";

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
      <Headers />
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
            <Home />
          </Page_Component>
        }
      />
      <Route
        path="/language"
        element={
          <Page_Component>
            <Language />
          </Page_Component>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/return-order" element={<Return_order />} />
      <Route path="/signin" element={<Signin />} />
    </>
  )
);

Page_Component.propTypes = {
  children: PropTypes.node,
};

export default router;
