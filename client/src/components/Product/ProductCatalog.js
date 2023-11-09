import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../shared/Navbar";
import ProductCard from "./ProductCard";
import Footer from "../../shared/Footer";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

export default function ProductCatalog({ setAuth, setUser }) {
  const [searchText, setSearchedText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(
    JSON.parse(sessionStorage.getItem("cart")) || []
  );
  const [users, setUsers] = useState([]);
  // const [cartItems, setCartItems] = useState(
  //   JSON.parse(sessionStorage.getItem("cart")) || []
  // );
  // useEffect(() => {
  //   const updatedCartItems = JSON.parse(sessionStorage.getItem("cart")) || [];
  //   setCartItems(updatedCartItems);
  // }, []);
  //search implementation

  var filteredProducts = products;
  if (products.length == undefined) {
    filteredProducts = products;
  } else {
    filteredProducts =
      selectedCategory === "All" && searchText === ""
        ? products
        : selectedCategory === "All" && searchText !== ""
        ? products.filter((product) =>
            product.product_name
              .toString()
              .toLowerCase()
              .includes(searchText.toString().toLowerCase())
          )
        : products.filter(
            (product) =>
              product.product_category === selectedCategory &&
              product.product_name
                .toString()
                .toLowerCase()
                .includes(searchText.toString().toLowerCase())
          );
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };
  function setQuery(searchText, selectedCategory) {
    setSearchedText(searchText);
    setSelectedCategory(selectedCategory);
  }

  async function getProductsByFarmer(id) {
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const productsByFarmerRes = await response.json();
      setProducts(productsByFarmerRes);
      // console.log(productsByFarmerRes);
    } catch (err) {
      console.error(err.message);
    }
  }
  async function getProducts() {
    try {
      const response = await fetch("http://localhost:5000/products", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const productsRes = await response.json();
      // undefined
      setProducts(productsRes["product"]);
      setUsers(productsRes["user"]);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getFarmers() {
    try {
      const response = await fetch("http://localhost:5000/users/farmers", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const farmers = await response.json();
      setFarmers(farmers);
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

  function handleFarmerClick(farmer) {
    setSearchedText("");
    setSelectedCategory("All");
    setSelectedFarmer(farmer);
    getProductsByFarmer(farmer.user_id);
  }
  function FarmerCard({ farmer, isSelected, onClick }) {
    return (
      <div
        className={`card ${isSelected ? "border-success " : ""}`}
        onClick={onClick}
      >
        <div className="card-body">
          <h5 className="card-title">{farmer.user_name}</h5>
          <p className="card-text text-muted ">{farmer.user_email}</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    getProducts();
    getFarmers();
  }, []);

  return (
    <Fragment>
      {console.log(JSON.parse(sessionStorage.getItem("cart")) || [])}
      <Navbar setAuth={setAuth} setUser={setUser} setQuery={setQuery}></Navbar>
      {/* TOP SECTION */}

      <div className="container my-5">
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Select A Farmer</h5>
              </div>
              <div className="card-body">
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {farmers.map((farmer) => (
                    <div className="col" key={farmer.user_id}>
                      <FarmerCard
                        farmer={farmer}
                        isSelected={farmer === selectedFarmer}
                        onClick={() => handleFarmerClick(farmer)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Your Farmer</h5>
              </div>
              <div className="card-body">
                {selectedFarmer ? (
                  <div>
                    <h5>{selectedFarmer.user_name}</h5>
                    <p>{selectedFarmer.user_email}</p>
                    <p>{selectedFarmer.user_contact}</p>
                  </div>
                ) : (
                  <p>Please select a farmer to continue shopping!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <main class="container my-5">
        <div class="row">
          <div class="col-md-3">
            <h2 className="font-700 mb-5 text-muted">Categories</h2>

            <ul class="list-group">
              <li class="list-group-item p-0 mb-2">
                <button
                  className={`btn w-100 d-flex justify-content-between align-items-center ${
                    selectedCategory === "All" ? "btn-success" : ""
                  }`}
                  onClick={() => handleCategoryClick("All")}
                >
                  <span className="font-600">All Categories</span>
                  <i className="fa-solid fa-basket-shopping fa-lg py-3 pe-4"></i>
                </button>
              </li>
              <li class="list-group-item p-0 my-2 border-top">
                <button
                  className={`btn w-100  d-flex justify-content-between align-items-center ${
                    selectedCategory === "Fruits" ? "btn-success" : ""
                  }`}
                  onClick={() => handleCategoryClick("Fruits")}
                >
                  <span className="font-600"> Fruits</span>
                  <i className="fa-solid fa-apple-whole fa-lg py-3 pe-4"></i>
                </button>
              </li>
              <li class="list-group-item p-0 my-2 border-top">
                <button
                  className={`btn w-100 d-flex justify-content-between align-items-center ${
                    selectedCategory === "Vegetables" ? "btn-success" : ""
                  }`}
                  onClick={() => handleCategoryClick("Vegetables")}
                >
                  <span className="font-600"> Vegetables</span>

                  <i className="fa-solid fa-carrot fa-lg py-3 pe-4"></i>
                </button>
              </li>
              <li class="list-group-item p-0 my-2 border-top">
                <button
                  className={`btn w-100 d-flex justify-content-between align-items-center ${
                    selectedCategory === "Herbs and Spices" ? "btn-success" : ""
                  }`}
                  onClick={() => handleCategoryClick("Herbs and Spices")}
                >
                  <span className="font-600"> Herbs and Spices</span>

                  <i className="fa-solid fa-seedling fa-lg py-3 pe-4"></i>
                </button>
              </li>
              <li class="list-group-item p-0 my-2 border-top">
                <button
                  className={`btn w-100 d-flex justify-content-between align-items-center ${
                    selectedCategory === "Meat and Poultry" ? "btn-success" : ""
                  }`}
                  onClick={() => handleCategoryClick("Meat and Poultry")}
                >
                  <span className="font-600">Meat and Poultry</span>

                  <i className="fa-solid fa-bacon fa-lg py-3 pe-4"></i>
                </button>
              </li>
              <li class="list-group-item p-0 my-2 border-top">
                <button
                  className={`btn w-100 d-flex justify-content-between align-items-center ${
                    selectedCategory === "Dairy Products" ? "btn-success" : ""
                  }`}
                  onClick={() => handleCategoryClick("Dairy Products")}
                >
                  <span className="font-600">Dairy Products</span>

                  <i className="fa-solid fa-cow fa-lg py-3 pe-4"></i>
                </button>
              </li>
            </ul>
          </div>
          <div className="col-md-8">
            <h2 className="font-700 mb-5">Products</h2>
            <div className="row">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div className="col-md-4" key={product.product_id}>
                    <div className="card shadow p-3 mb-4">
                      <Link to={`/prdetails/${product.product_id}`}>
                        <img
                          // src={require("../../assets/" + product.product_image)}
                          // src={require("../../../../server/public/images/" +
                          //   product.product_image)}
                          src={require("../../../../server/public/images/" +
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
                        <h5 className="card-title font-700 ">
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
                  <span className="font-500 fs-3">No products found!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
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
}
