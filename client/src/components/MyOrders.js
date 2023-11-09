import React, { Fragment, useState, useEffect } from "react";
import Footer from "../shared/Footer";
import Navbar from "../shared/Navbar";
export default function MyOrders({ setAuth, setUser }) {
  const [random, setRandom] = useState(false);
  const [orders, setOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [rejectedOrders, setRejectedOrders] = useState([]);
  const [allFarmers, setAllFarmers] = useState([]);
  useEffect(() => {
    fetchOrders();
    getAcceptedOrders();
    getPendingOrders();
    getRejectedOrders();
    getAllFarmers();
  }, []);

  const user_id = sessionStorage.getItem("user_id");
  console.log("userid ", user_id);

  async function fetchOrders() {
    try {
      const response = await fetch(
        `http://localhost:5000/orders/user/${user_id}`,
        {
          method: "GET",
        }
      );

      const orderRes = await response.json();
      const ordersWithParsedCartItems = orderRes.map((order) => ({
        ...order,
        cart_items: order.cart_items.map((item) => JSON.parse(item)),
      }));
      setOrders(ordersWithParsedCartItems);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getAcceptedOrders() {
    try {
      const response = await fetch(
        `http://localhost:5000/orders/user/${user_id}/accepted`,
        {
          method: "GET",
        }
      );
      if (response.status === 404) {
        console.log("no accepted orders");
      } else {
        const orderRes = await response.json();
        const ordersWithParsedCartItems = orderRes.map((order) => ({
          ...order,
          cart_items: order.cart_items.map((item) => JSON.parse(item)),
        }));
        setAcceptedOrders(ordersWithParsedCartItems);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getPendingOrders() {
    try {
      const response = await fetch(
        `http://localhost:5000/orders/user/${user_id}/pending`,
        {
          method: "GET",
        }
      );

      const orderRes = await response.json();
      const ordersWithParsedCartItems = orderRes.map((order) => ({
        ...order,
        cart_items: order.cart_items.map((item) => JSON.parse(item)),
      }));
      setPendingOrders(ordersWithParsedCartItems);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getRejectedOrders() {
    try {
      const response = await fetch(
        `http://localhost:5000/orders/user/${user_id}/rejected`,
        {
          method: "GET",
        }
      );

      const orderRes = await response.json();
      const ordersWithParsedCartItems = orderRes.map((order) => ({
        ...order,
        cart_items: order.cart_items.map((item) => JSON.parse(item)),
      }));
      setRejectedOrders(ordersWithParsedCartItems);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getAllFarmers() {
    try {
      const response = await fetch(`http://localhost:5000/users/farmers`, {
        method: "GET",
      });

      const farmerRes = await response.json();
      setAllFarmers(farmerRes);
    } catch (err) {
      console.error(err.message);
    }
  }
  // async function deleteOrder(order_id) {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:5000/orders/delete/${order_id}`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //     if (!response.ok) {
  //       throw new Error("Unable to delete order");
  //     }
  //     const updatedWishlist = await response.json();
  //     setRandom(true);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  function getUserNameById(user_id) {
    const farmer = allFarmers.find((farmer) => farmer.user_id === user_id);
    return farmer ? farmer.user_name : null;
  }
  return (
    <Fragment>
      <Navbar setUser={setUser} setAuth={setAuth}></Navbar>
      <div className="container">
        <div className="row my-4">
          <div
            className="col-lg-4 scrollable-div overflow-auto"
            style={{ height: "100%" }}
          >
            <h3 className="font-500 text-center my-3 bg-warning rounded text-white py-2">
              Pending Orders
            </h3>
            {pendingOrders.map((pendingOrder) => (
              <div
                className="card  mb-3 font-500 shadow"
                key={pendingOrder.order_id}
              >
                <div className="card-body">
                  <h3 className="card-title">
                    {" "}
                    {getUserNameById(pendingOrder.cart_items[0].farmer_id)}
                  </h3>
                  <ul className="list-group list-group-flush">
                    {pendingOrder.cart_items.map((product) => (
                      <li
                        className="list-group-item  rounded my-2 bg-secondary text-white"
                        key={product.product_id}
                      >
                        <h4>{product.product_name}</h4>
                        <p>Unit Price: {product.product_price}</p>
                        <p>Quantity: {product.quantity}</p>
                        <p>
                          Subtotal: {product.product_price * product.quantity}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <p className="card-text font-600">
                    {pendingOrder.cart_items.reduce(
                      (total, product) =>
                        total + product.product_price * product.quantity,
                      0
                    )}
                    BTN
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="col-lg-4 scrollable-div">
            <h3 className="font-500 text-center my-3 bg-success rounded text-white py-2">
              Accepted Orders
            </h3>
            {acceptedOrders.map((acceptedOrder) => (
              <div
                className="card  mb-3 font-500 shadow"
                key={acceptedOrder.order_id}
              >
                <div className="card-body">
                  <h3 className="card-title d-flex align-items-center">
                    <span>
                      {getUserNameById(acceptedOrder.cart_items[0].farmer_id)}
                    </span>
                  </h3>
                  <ul className="list-group list-group-flush">
                    {acceptedOrder.cart_items.map((product) => (
                      <li
                        className="list-group-item bg-secondary text-white rounded my-2 "
                        key={product.product_id}
                      >
                        <h4>{product.product_name}</h4>
                        <p>Unit Price: {product.product_price}</p>
                        <p>Quantity: {product.quantity}</p>
                        <p>
                          Subtotal: {product.product_price * product.quantity}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <p className="card-text font-600">
                    {acceptedOrder.cart_items.reduce(
                      (total, product) =>
                        total + product.product_price * product.quantity,
                      0
                    )}{" "}
                    BTN
                  </p>
                  <p className="card-text">
                    <i className="fa fa-user text-success me-3"></i>
                    {acceptedOrder.driver_name}
                  </p>
                  <p className="card-text">
                    <i className="fa fa-phone text-success me-3"></i>{" "}
                    {acceptedOrder.driver_contact}
                  </p>
                  <p className="card-text">
                    <i className="fa fa-car text-success me-3"></i>
                    {acceptedOrder.vehicle_number}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="col-lg-4 scrollable-div ">
            <h3 className="font-500 text-center my-3 bg-danger rounded text-white py-2">
              Rejected Orders
            </h3>
            {rejectedOrders.map((rejectedOrder) => (
              <div
                className="card mb-3 font-500 shadow"
                key={rejectedOrder.order_id}
              >
                <div className="card-body">
                  <h3 className="card-title">
                    {" "}
                    {getUserNameById(rejectedOrder.cart_items[0].farmer_id)}
                  </h3>
                  <ul className="list-group list-group-flush">
                    {rejectedOrder.cart_items.map((product) => (
                      <li
                        className="list-group-item rounded my-2 bg-secondary text-white"
                        key={product.product_id}
                      >
                        <h4>{product.product_name}</h4>
                        <p>Unit Price: {product.product_price}</p>
                        <p>Quantity: {product.quantity}</p>
                        <p>
                          Subtotal: {product.product_price * product.quantity}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <p className="card-text bg-secondary text-white p-2 rounded">
                    {rejectedOrder.reject_des}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </Fragment>
  );
}
