import React, { Fragment, useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// components
import ProfileSettings from "./Admin/ProfileSettings";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import ProductCatalog from "./components/Product/ProductCatalog";
import Cart from "./components/Cart";
import AboutUs from "./components/AboutUs";
import CheckOut from "./components/CheckOut";
import ProductDetails from "./components/Product/ProductDetails";
import WishList from "./components/WishList";
import Profile from "./components/Profile";
import AdminDashboard from "./Admin/AdminDashboard";
import StockUpdate from "./Admin/StockUpdate";
//import context
import OrderCountdownContext from "./context/context";
import MyOrders from "./components/MyOrders";
import FarmerOrders from "./Admin/FarmerOrders";
import StockUpload from "./Admin/StockUpload";

function App() {
  const [orderCountdown, setOrderCountdown] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("token")) || null
  );
  const [admin, setAdmin] = useState(
    JSON.parse(sessionStorage.getItem("admin")) || null
  );

  const setAuth = (boolean) => {
    // localStorage.setItem('isAuthenticated', boolean);
    setIsAuthenticated(boolean);
  };

  function checkIsAdmin(user_id) {}
  // async function isAuth() {
  //   try {
  //     const response = await fetch("http://localhost:5000/auth/verified", {
  //       method: "POST",
  //       headers: { token: localStorage.token },
  //     });

  //     const parseRes = await response.json();

  //     console.log(parseRes);
  //     parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // }

  // useEffect(() => {
  //   isAuth();
  // }, []);

  return (
    <Fragment>
      <OrderCountdownContext.Provider
        value={{ orderCountdown, setOrderCountdown }}
      >
        <Router>
          {console.log("AUTH", isAuthenticated)}
          <Routes>
            <Route
              path="/"
              element={
                !user ? (
                  <Login
                    setAuth={setAuth}
                    setAdmin={setAdmin}
                    setUser={setUser}
                  />
                ) : admin ? (
                  <Navigate to="/admin/dashboard"></Navigate>
                ) : (
                  // <AdminDashboard
                  //   setAdmin={setAdmin}
                  //   setUser={setUser}
                  // ></AdminDashboard>
                  // <Dashboard setAuth={setAuth} setUser={setUser} />
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="/register"
              element={
                !user ? (
                  <Register setAuth={setAuth} setUser={setUser} />
                ) : admin ? (
                  <AdminDashboard
                    setAdmin={setAdmin}
                    setUser={setUser}
                  ></AdminDashboard>
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />

            {admin ? (
              <>
                <Route
                  path="/admin"
                  element={
                    user ? (
                      <AdminDashboard setAdmin={setAdmin} setUser={setUser} />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                >
                  <Route
                    path="profilesettings"
                    element={<ProfileSettings></ProfileSettings>}
                  />
                  <Route
                    path="dashboard"
                    element={<FarmerOrders></FarmerOrders>}
                  />
                  <Route
                    path="stockupload"
                    element={<StockUpload></StockUpload>}
                  />
                  <Route
                    path="stockupdate"
                    element={<StockUpdate></StockUpdate>}
                  />
                </Route>
              </>
            ) : (
              <>
                <Route
                  path="/dashboard"
                  element={
                    user ? (
                      <Dashboard setAuth={setAuth} setUser={setUser} />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
                <Route
                  path="/cart"
                  element={
                    user ? (
                      <Cart setUser={setUser} setAuth={setAuth} />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
                <Route
                  path="/products"
                  element={
                    user ? (
                      <ProductCatalog setAuth={setAuth} setUser={setUser} />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
                <Route
                  path="/prdetails/:productId"
                  element={
                    user ? (
                      <ProductDetails setAuth={setAuth} setUser={setUser} />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    user ? (
                      <CheckOut setAuth={setAuth} setUser={setUser} />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    user ? (
                      <WishList setAuth={setAuth} setUser={setUser} />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
                <Route
                  path="/profile"
                  element={
                    user ? (
                      <Profile setAuth={setAuth} setUser={setUser} />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
                <Route
                  path="/myorders"
                  element={
                    user ? (
                      <MyOrders setAuth={setAuth} setUser={setUser} />
                    ) : (
                      <Navigate to="/" />
                    )
                  }
                />
              </>
            )}
          </Routes>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </Router>
      </OrderCountdownContext.Provider>
    </Fragment>
  );
}

export default App;
