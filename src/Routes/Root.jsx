import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import Headers from "../Section/Header.jsx"
import Home from "../Section/Home.jsx"
import Language from "../NavPages/Language.jsx"
import Login from "../NavPages/Login.jsx"
import Return_order from "../NavPages/Return_order.jsx"
import PropTypes from "prop-types"
import Signin from "../Components/Signin.jsx"

const Page_Component = ({ children }) => {
  return (
    <div>
      <Headers />
      <div>{children}</div>
    </div>
  )
}



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
      <Route
        path="/login"
        element={<Login />}
        />
      <Route
        path="/return-order"
        element={
          <Page_Component>
            <Return_order />
          </Page_Component>
        }
        />
      <Route
        path="/signin"
        element={
            <Signin />
        }
        />
    </>,
  ),
)

Page_Component.propTypes = {
  children: PropTypes.node,
}

export default router 


// component folder ui sorting