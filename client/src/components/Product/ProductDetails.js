import React, { useEffect, useRef } from "react";
import { Fragment, useState } from "react";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
function ProductDetails({ setAuth, setUser }) {
  const [isFav, setIsFav] = useState(false);
  const [product, setProduct] = useState([]);
  const [productCategory, setProductCategory] = useState("");
  const pc = useRef("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [products, setProducts] = useState();
  const [users, setUsers] = useState([]);
  const [cartItems, setCartItems] = useState(
    JSON.parse(sessionStorage.getItem("cart")) || []
  );
  const { productId } = useParams();
  const user_id = sessionStorage.getItem("user_id");

  const filterRelatedProducts = relatedProducts.filter(
    (product) => product.product_id !== productId
  );

  if (isFav) {
    addProductToWishlist(productId, user_id);
  } else {
    deleteProductFromWishlist(productId, user_id);
  }

  async function addProductToWishlist(productId, userId) {
    try {
      const response = await fetch(
        `http://localhost:5000/wishlist/${userId}/${productId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("Unable to add product to wishlist");
      }
      const updatedWishlist = await response.json();
    } catch (error) {
      console.error(error);
    }
  }
  async function deleteProductFromWishlist(productId, userId) {
    try {
      const response = await fetch(
        `http://localhost:5000/wishlist/${userId}/${productId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("Unable to delete product from wishlist");
      }
      const updatedWishlist = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function fetchWishlist() {
    try {
      const response = await fetch(
        `http://localhost:5000/wishlist/${user_id}`,
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      if (response.ok) {
        const wishlistRes = await response.json();
        const productExistsInWishlist = wishlistRes.some((product) => {
          return product.product_id === productId;
        });
        if (productExistsInWishlist) {
          setIsFav(true);
        } else {
          setIsFav(false);
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getAProduct(id) {
    try {
      const response = await fetch(`http://localhost:5000/products/get/${id}`, {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const prd = await response.json();
      setProduct(prd);

      pc.current = prd[0].product_category;
    } catch (err) {
      console.error(err.message);
    }
  }
  async function getProductsByCategory(category) {
    try {
      const response = await fetch(
        `http://localhost:5000/products/getproduct/${category}`,
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const prdRes = await response.json();
      console.log(prdRes);
      setRelatedProducts(prdRes);
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

  useEffect((product_id, productCategory) => {
    async function fetchData() {
      await getAProduct(productId);
      await getProducts();
      await getProductsByCategory(pc.current);
    }

    fetchData();
  }, []);

  return (
    <Fragment>
      <Navbar></Navbar>
      <div className="main-container">
        {product.map((product, index) => (
          <div key={index} className="container  my-5" style={{ height: 500 }}>
            <div className="row py-5 h-100">
              <div className="col-md-6">
                <img
                  src={require("../../../../server/public/images/" +
                    product.product_image)}
                  alt={product.product_name}
                  className="w-100"
                />
              </div>
              <div className="col-md-6 h-100 d-flex flex-column h-100">
                <div className="row">
                  <div className="col-md-10">
                    <h2 className="fw-bold fs-1 font-700">
                      {product.product_name}
                    </h2>
                  </div>
                  <div className="col-md-2">
                    <button
                      className="border border-light bg-white "
                      onClick={() => {
                        isFav ? setIsFav(false) : setIsFav(true);
                      }}
                    >
                      <i
                        className={`fa-regular fa-heart text-danger fa-xl ${
                          isFav ? "fa-solid" : ""
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>

                <p className="fs-4 font-600">BTN {product.product_price}</p>
                <p className="fs-5 font-400">{product.product_description}</p>

                <p className="fs-5 font-600">Farmer: {product.farmer_name}</p>

                <button
                  className="btn btn-success me-3 font-500   mt-auto w-75"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="container h-50 my-5">
          <h3 className="fw-bold mb-4">You May Also Like</h3>
          <div className="row row-cols-1 row-cols-md-4 g-4">
            {filterRelatedProducts.length > 0 ? (
              filterRelatedProducts.map((product) => (
                <div className="col" key={product.product_id}>
                  <div className="card shadow p-3">
                    <Link
                      to={`/prdetails/${product.product_id}`}
                      reloadDocument
                    >
                      <img
                        src={require("../../../../server/public/images/" +
                          product.product_image)}
                        className="card-img-top"
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
                    <div className="card-footer d-flex pt-4 bg-transparent justify-content-between align-items-center">
                      <p
                        className="card-text h6 p-0 m-0"
                        style={{ color: "green" }}
                      >
                        {product.product_price + " "}BTN
                      </p>
                      <button
                        className="btn btn-success"
                        onClick={() => addToCart(product)}
                      >
                        <i className="fa-solid fa-cart-shopping me-2"></i>{" "}
                        <span>Add to cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-md-4">
                <span className="font-500 fs-3">
                  Sorry, there are no products available.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer></Footer>
      {/* new */}
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
    </Fragment>
  );
}

export default ProductDetails;
