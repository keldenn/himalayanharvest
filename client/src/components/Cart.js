import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Link } from "react-router-dom";
import Footer from "../shared/Footer";
const Cart = ({ setAuth, setUser, setQuery }) => {
  const [cartItems, setCartItems] = useState(
    JSON.parse(sessionStorage.getItem("cart")) || []
  );
  const removeItemFromCart = (id) => {
    const updatedCartItems = cartItems.filter((item) => item.product_id !== id);
    sessionStorage.setItem("cart", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  };

  const incrementQuantity = (id) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.product_id === id) {
        return { ...item, quantity: item.quantity + 1 };
      } else {
        return item;
      }
    });
    sessionStorage.setItem("cart", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  };

  const decrementQuantity = (id) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.product_id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      } else {
        return item;
      }
    });
    sessionStorage.setItem("cart", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  };
  function clearCart() {
    const updatedCartItems = [];
    sessionStorage.setItem("cart", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  }
  const grandTotal = cartItems.reduce((total, item) => {
    return total + item.product_price * item.quantity;
  }, 0);

  useEffect(() => {
    const updatedCartItems = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCartItems(updatedCartItems);
  }, []);

  return (
    <div>
      <Navbar setAuth={setAuth} setUser={setUser} setQuery={setQuery}></Navbar>

      <div className="container py-3 my-3">
        {cartItems.length === 0 ? (
          <div>
            <div className="w-100 text-center">
              <img src={require("../assets/emprycart.png")} />
            </div>
            <div className="text-center my-5">
              <h1 className="font-700">Your Cart is Empty</h1>
              <p className="font-500">Add something to make me happy!</p>
            </div>
            <div className="text-center my-5">
              <Link
                className="text-decoration-none text-center w-100"
                to="/products"
              >
                <button className="btn btn-success text-center font-500">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="font-700 pb-3">My Cart</h2>
            <div>
              <Link
                to="/products"
                className="text-decoration-none text-dark font-600 "
              >
                <i className="fa-solid fa-arrow-left me-2"></i>
                Continue shopping
              </Link>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th className="text-center" scope="col">
                    Product
                  </th>
                  <th className="text-center" scope="col">
                    Item Name
                  </th>
                  <th className="text-center" scope="col">
                    Unit Price
                  </th>
                  <th className="text-center" scope="col">
                    Quantity
                  </th>
                  <th className="text-center" scope="col">
                    Total Price
                  </th>
                  <th className="text-center" scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={item.product_id}>
                    <td className="w-25">
                      <img
                        className="img-fluid"
                        src={require("../../../server/public/images/" +
                          item.product_image)}
                        alt={item.product_name}
                      />
                    </td>
                    <td className="text-center font-600 fs-5 align-middle f">
                      {item.product_name}
                    </td>
                    <td className="text-center font-600 fs-5 align-middle">
                      {item.product_price} BTN
                    </td>
                    <td className="" style={{ height: "100%" }}>
                      <div
                        className="d-flex justify-content-center align-items-center   "
                        style={{ height: 200 }}
                      >
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => decrementQuantity(item.product_id)}
                        >
                          -
                        </button>
                        <span className="text-center mx-3 font-600 fs-5">
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-sm btn-outline-secondary "
                          onClick={() => incrementQuantity(item.product_id)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-center align-middle font-600 fs-5">
                      {item.product_price * item.quantity} BTN
                    </td>
                    <td>
                      <div
                        className="d-flex justify-content-center align-items-center   "
                        style={{ height: 200 }}
                      >
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => removeItemFromCart(item.product_id)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-end">
                    Grand Total:
                  </td>
                  <td className="font-700">{grandTotal} BTN</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
        {cartItems.length === 0 ? (
          <></>
        ) : (
          <>
            <div className="d-flex justify-content-between ">
              <div className="text-start">
                <button className="btn btn-danger" onClick={clearCart}>
                  Clear cart
                </button>
              </div>
              <div className="text-end">
                <Link to="/checkout">
                  <button className="btn btn-success">Safe to Checkout</button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Cart;
