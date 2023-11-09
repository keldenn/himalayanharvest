// eslint-disable-next-line
import React, { Fragment, useState, useEffect } from "react";
import Footer from "../shared/Footer";
import Navbar from "../shared/Navbar";
import img from "../assets/dashboard/divbg2.png";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "../components/dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Dashboard = ({ setAuth, setUser }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(
    JSON.parse(sessionStorage.getItem("cart")) || []
  );
  async function getFeaturedProducts() {
    try {
      const response = await fetch("http://localhost:5000/products/featured", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const productsRes = await response.json();
      setProducts(productsRes);
    } catch (err) {
      console.error(err.message);
    }
  }
  function addToCart(product) {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    let item = {
      product_id: product.product_id,
      product_name: product.product_name,
      product_price: product.product_price,
      product_image: product.product_image,
      quantity: 1,
      farmer_id: product.farmer_id,
    };

    if (cart.length > 0) {
      let existingFarmerId = cart[0].farmer_id;
      for (let i = 1; i < cart.length; i++) {
        if (cart[i].farmer_id !== existingFarmerId) {
          toast.error(
            `You can only add items from the same farmer to your cart.`,
            {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
          return;
        }
      }
      if (existingFarmerId !== product.farmer_id) {
        toast.error(
          `You can only add items from the same farmer to your cart.`,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
        return;
      }
    }

    // Check if item is already in cart, if yes then increase its quantity by 1
    let existingItem = cart.find(
      (item) => item.product_id === product.product_id
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(item);
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart);

    toast.success(`Added ${item.product_name} to your cart!`, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  useEffect(() => {
    getFeaturedProducts();
  }, []);
  return (
    <Fragment>
      <Navbar setAuth={setAuth} setUser={setUser}></Navbar>
      <div className="vh-50">
        {/* first */}
        {console.log(products)}
        <div
          className="banner bg-image"
          style={{
            backgroundImage: `url(${img})`,
            backgroundColor: "#C5EAD9",
          }}
        >
          <div className=" h-100">
            <div className="row  p-0 m-0 h-100">
              <div className="col-md-6 d-flex align-items-center ">
                <div className="banner-text container w-75 ">
                  <h2 className="font-700" style={{ color: "#253D4E" }}>
                    Don't miss our daily amazing deals.
                  </h2>
                  <p className="text-muted font-500 mt-4">
                    Save up to 60% off on your first order
                  </p>
                  <button className="btn btn-success w-50 mt-4">
                    <Link
                      to="/products"
                      className="text-decoration-none text-white font-500"
                    >
                      Shop now
                    </Link>
                  </button>
                </div>
              </div>
              <div className="col-md-6 d-flex justify-content-center align-items-center p-0 h-100">
                <div className="banner-image h-100 d-none d-sm-none d-md-block d-lg-block"></div>
              </div>
            </div>
          </div>
        </div>
        {/* second */}

        <div className="container my-5">
          <h3 className="font-600">Shop by categories</h3>
          <div className="row">
            <div className="col-md-4 col-sm-6 col-12">
              <Link
                to="/products"
                className="shadow-lg text-decoration-none p-3 rounded text-success m-4 text-center d-flex flex-column justify-content-center align-items-center"
              >
                <i className="fa-solid fa-basket-shopping fa-2xl py-4"></i>
                <span className="py-2 font-400">All category</span>
              </Link>
            </div>
            <div className="col-md-4 col-sm-6 col-12">
              <Link
                to="/products"
                className="shadow-lg text-decoration-none p-3 rounded text-success m-4 text-center d-flex flex-column justify-content-center align-items-center"
              >
                <i className="fa-solid fa-apple-whole fa-2xl py-4"></i>
                <span className="py-2 font-400">Fruits</span>
              </Link>
            </div>
            <div className="col-md-4 col-sm-6 col-12">
              <Link
                to="/products"
                className="shadow-lg text-decoration-none p-3 rounded text-success m-4 text-center d-flex flex-column justify-content-center align-items-center"
              >
                <i className="fa-solid fa-carrot fa-2xl py-4"></i>
                <span className="py-2 font-400">Vegetables</span>
              </Link>
            </div>
            <div className="col-md-4 col-sm-6 col-12">
              <Link
                to="/products"
                className="shadow-lg text-decoration-none p-3 rounded text-success m-4 text-center d-flex flex-column justify-content-center align-items-center"
              >
                <i className="fa-solid fa-seedling fa-2xl py-4"></i>
                <span className="py-2 font-400">Herbs and Spices</span>
              </Link>
            </div>
            <div className="col-md-4 col-sm-6 col-12">
              <Link
                to="/products"
                className="shadow-lg text-decoration-none p-3 rounded text-success m-4 text-center d-flex flex-column justify-content-center align-items-center"
              >
                <i className="fa-solid fa-bacon fa-2xl py-4"></i>
                <span className="py-2 font-400">Meat and Poultry</span>
              </Link>
            </div>
            <div className="col-md-4 col-sm-6 col-12">
              <Link
                to="/products"
                className="shadow-lg text-decoration-none p-3 rounded text-success m-4 text-center d-flex flex-column justify-content-center align-items-center"
              >
                <i className="fa-solid fa-cow fa-2xl py-4"></i>
                <span className="py-2 font-400">Dairy Products</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Third */}
        <div className="container col-md-9">
          <h3 className="font-600 mb-4">Featured Products</h3>
          <div className="row">
            {products.length > 0 ? (
              products.map((product) => (
                <div className="col-md-3" key={product.product_id}>
                  <div className="card shadow p-3 mb-4">
                    <Link to={`/prdetails/${product.product_id}`}>
                      <img
                        src={require("../../../server/public/images/" +
                          product.product_image)}
                        className="card-img-top"
                        //   style={{ maxWidth: 100 }}
                        alt={product.product_name}
                      />
                    </Link>
                    <div className="card-body">
                      <p className="card-text text-muted font-600">
                        {product.product_category}
                      </p>
                      <h5 className="card-title font-700">
                        {product.product_name}
                      </h5>
                      <p className="card-text font-500">
                        {"By Farmer ".concat(product.farmer_name)}
                      </p>
                    </div>
                    <div class="card-footer d-flex pt-4 bg-transparent  justify-content-between align-items-center">
                      <p
                        className="card-text h6 p-0 m-0 "
                        style={{ color: "green" }}
                      >
                        {product.product_price + " "}
                        BTN
                      </p>
                      <button
                        className="btn btn-success "
                        onClick={() => addToCart(product)}
                      >
                        <i class="fa-solid fa-cart-shopping me-2"></i>{" "}
                        <span>Add to cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className=" col-md-4">
                <span className="font-500 fs-3">No featured products</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* fourth */}
      <div className="container my-5" style={{ height: 350 }}>
        <div className="row h-100">
          {/* left con */}
          <div className="col-6 p-2 h-100">
            <div
              className="row p-4 me-1 h-100 banner rounded"
              style={{
                backgroundImage: `url(${img})`,
                backgroundColor: "#FFF5E1",
              }}
            >
              <div className="col-lg-7">
                <div className="p-3">
                  <span
                    className="text-white w-25 bg-warning p-2 rounded font-300"
                    style={{ fontSize: 11 }}
                  >
                    Free delivery
                  </span>
                </div>
                <h3 className="font-600 ps-3 pt-3">Free delivery over 50</h3>
                <p className="text-muted font-400 ps-3">
                  Shop 50 products and get free delivery anywhere.
                </p>
                <div className="ps-3">
                  <Link className="text-decoration-none" to="/products">
                    <button className="btn mt-4 btn-success text-white font-500">
                      Shop Now<i className="fa-solid fa-arrow-right ms-2"></i>
                    </button>
                  </Link>
                </div>
              </div>
              {/* img */}
              <div className="col-5 d-none d-md-none d-lg-block">
                <img
                  className="img-fluid  "
                  style={{ maxHeight: 310 }}
                  src={require("../assets/dashboard/free1.png")}
                  alt="Banner"
                />
              </div>
            </div>
          </div>
          {/* right con */}
          <div className="col-6 p-2 h-100">
            <div
              className="row p-4 h-100 ms-1 banner rounded"
              style={{
                backgroundImage: `url(${img})`,
                backgroundColor: "#DEF9EC",
              }}
            >
              <div className="col-lg-6">
                <div className="p-3">
                  <span
                    className="text-white w-25 bg-success p-2 rounded font-300"
                    style={{ fontSize: 11 }}
                  >
                    Free delivery
                  </span>
                </div>
                <h3 className="font-600 ps-3 pt-3">Organic Food</h3>
                <p className="text-muted font-400 ps-3">
                  Save up to 60% off on your first order.
                </p>
                <div className="ps-3">
                  <Link className="text-decoration-none" to="/products">
                    <button className="btn mt-4 btn-success text-white font-500">
                      Order Now<i className="fa-solid fa-arrow-right ms-2"></i>
                    </button>
                  </Link>
                </div>
              </div>
              <div className="col-6" style={{ marginTop: 33 }}>
                <img
                  className="img-fluid rounded d-none d-md-none d-lg-block"
                  style={{ maxHeight: 277 }}
                  src={require("../assets/dashboard/free2.png")}
                  alt="Banner"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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

      <Footer></Footer>
    </Fragment>
  );
};

export default Dashboard;
