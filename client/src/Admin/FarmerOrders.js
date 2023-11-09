import React, { Fragment, useState, useEffect, useContext } from "react";
import OrderCountdownContext from "../context/context";
import { useResolvedPath } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [rejectedOrders, setRejectedOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [random, setRandom] = useState(false);
  const [rejectDes, setRejectDes] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverContact, setDriverContact] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [products, setProducts] = useState([]);
  //can use orderCountdown and setOrderCountdown
  const { orderCountdown, setOrderCountdown } = useContext(
    OrderCountdownContext
  );

  const farmer_id = sessionStorage.getItem("user_id");
  console.log("FarmerID:", farmer_id);
  async function getAllOrders() {
    try {
      const response = await fetch(
        `http://localhost:5000/orders/${farmer_id}`,
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
        `http://localhost:5000/orders/${farmer_id}/accepted`,
        {
          method: "GET",
        }
      );
      if (response.status == 404) {
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
        `http://localhost:5000/orders/${farmer_id}/pending`,
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

  async function acceptOrder(e, order) {
    // start countdown

    e.preventDefault();
    console.log(order);
    const orderID = order.order_id;

    try {
      const body = {
        orderID,
        driverName,
        driverContact,
        vehicleNumber,
      };

      const response = await fetch(
        `http://localhost:5000/orders/update/accepted`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const parseResponse = await response.json();
      if (response.status == 200) {
        getAcceptedOrders();
        getPendingOrders();
        toast.success(parseResponse, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error(parseResponse, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  }
  async function rejectOrder(e, order) {
    e.preventDefault();
    const orderID = order.order_id;

    try {
      const body = {
        orderID,
        rejectDes,
      };

      const response = await fetch(
        `http://localhost:5000/orders/update/rejected`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const parseResponse = await response.json();
      if (response.status == 200) {
        getAcceptedOrders();
        getPendingOrders();
        toast.error(parseResponse, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error(parseResponse, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  function convertTime(timeString) {
    const time = timeString.split(":");
    let hours = parseInt(time[0]);
    const minutes = time[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return hours + ":" + minutes + " " + ampm;
  }
  useEffect(() => {
    getAllOrders();
    getPendingOrders();
    getAcceptedOrders();
    getProducts();
  }, []);

  async function getProducts() {
    try {
      const response = await fetch("http://localhost:5000/products/all", {
        method: "GET",
      });

      const productsRes = await response.json();
      // undefined
      setProducts(productsRes);
    } catch (err) {
      console.error(err.message);
    }
  }
  // function to handle the view button click and set the selected order
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setRandom(true);
  };
  const handleRejectOrder = (order) => {
    setSelectedOrder(order);
    setRandom(true);
  };
  const handleAcceptOrder = (order) => {
    setSelectedOrder(order);
    setRandom(true);
  };

  const getProductStock = (product_id) => {
    const product = products.find(
      (product) => product.product_id === product_id
    );

    if (product) {
      return product.stock;
    }

    return 0; // If the product_id doesn't exist, return 0 as the default stock value
  };
  return (
    <Fragment>
      {console.log("products", products)}

      <div className="row p-3 justify-content-md-center">
        <div className="col-md-3 p-5 text-center fs-3 bg-success font-300 text-white shadow rounded">
          <i className="fa-regular fa-bell fs-3 me-3"></i>Orders:{" "}
          {pendingOrders.length}
        </div>
        <div class="col-md-auto"></div>
        <div className="col-md-3 p-5 text-center fs-3 text-success font-300   bg shadow rounded">
          <i className="fa-solid fa-list fs-3 me-3 "> </i>
          Products: {orders.length}
        </div>
      </div>
      <h2 className="font-700 ms-2 text-success">Your orders</h2>
      {pendingOrders.length == 0 ? (
        <div>
          <span className="font-400">no orders found!</span>
        </div>
      ) : (
        <div className="table-responsive w-100 mb-5 mt-3 w-75 shadow p-0 rounded text-center font-500">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>

                <th scope="col">Name</th>
                <th scope="col">Contact</th>
                <th scope="col">Dzongkhag</th>
                <th scope="col">Location</th>
                <th scope="col">Time</th>
                <th scope="col">Date</th>
                <th scope="col">Items</th>
                <th scope="col">Validate</th>
              </tr>
            </thead>
            <tbody>
              {console.log(pendingOrders)}
              {/* map through orders array and render each order */}
              {pendingOrders.map((order, index) => (
                <tr key={order.order_id}>
                  <th scope="row">{index + 1}</th>

                  <td>
                    {order.first_name} {order.last_name}
                  </td>
                  <td>{order.contact_number}</td>
                  <td>{order.dzongkhag}</td>
                  <td>{order.location_description}</td>
                  <td>{convertTime(order.time)}</td>
                  <td>{order.date}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#orderModal"
                      onClick={() => handleViewOrder(order)}
                    >
                      View
                    </button>
                  </td>
                  <td className="">
                    <button
                      className="btn btn-success me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#acceptModal"
                      onClick={() => handleAcceptOrder(order)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#rejectModal"
                      onClick={() => handleRejectOrder(order)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* NEXT TABLE accepted orders and rejected orders */}
      <h2></h2>
      <div className="table-responsive w-100 mb-5 mt-3 w-75 shadow p-0 rounded text-center font-500">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>

              <th scope="col">Name</th>
              <th scope="col">Contact</th>
              <th scope="col">Dzongkhag</th>
              <th scope="col">Location</th>
              <th scope="col">Time</th>
              <th scope="col">Date</th>
              <th scope="col">Items</th>
              <th scope="col">Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {/* map through orders array and render each order */}
            {acceptedOrders.map((order, index) => (
              <tr key={order.order_id}>
                <th scope="row">{index + 1}</th>

                <td>
                  {order.first_name} {order.last_name}
                </td>
                <td>{order.contact_number}</td>
                <td>{order.dzongkhag}</td>
                <td>{order.location_description}</td>
                <td>{convertTime(order.time)}</td>
                <td>{order.date}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#orderModal"
                    onClick={() => handleViewOrder(order)}
                  >
                    View
                  </button>
                </td>
                <td className="">
                  {order.order_status == "accepted" && (
                    <button
                      className="btn btn-warning btn-disabled text-white"
                      disabled
                    >
                      On progress
                    </button>
                  )}
                  {order.order_status == "rejected" && (
                    <button
                      className="btn btn-danger btn-disabled text-white"
                      disabled
                    >
                      Rejected
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal to display cart items */}

      <>
        <div
          className="modal fade font-500"
          id="orderModal"
          tabIndex="-1"
          aria-labelledby="orderModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered font-500">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="orderModalLabel">
                  Order Items
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col" className=" text-center">
                        Product
                      </th>

                      <th scope="col" className=" text-center">
                        Price
                      </th>
                      <th scope="col" className=" text-center">
                        Quantity
                      </th>
                      <th scope="col" className=" text-center">
                        Your Stock
                      </th>
                      <th scope="col" className=" text-center">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* map through the cart items in selected order and render each item */}

                    {selectedOrder &&
                      selectedOrder.cart_items.map((item) => (
                        <tr key={item.product_id}>
                          {console.log("item", item)}
                          <td className=" text-center">
                            <img
                              src={require("../../../server/public/images/" +
                                item.product_image)}
                              style={{ height: 45, width: 45 }}
                            />
                            {item.product_name}
                          </td>

                          <td className=" text-center">{item.product_price}</td>
                          <td className=" text-center">{item.quantity}</td>
                          <td className=" text-center">
                            {getProductStock(item.product_id)}
                          </td>
                          <td className=" text-center">
                            {item.product_price * item.quantity}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary font-500"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* accept modal */}

        <div
          className="modal fade font-500"
          id="acceptModal"
          tabIndex="-1"
          aria-labelledby="orderModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered font-500">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fs-4" id="orderModalLabel">
                  Driver Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body ">
                <div className="bg-warning p-1 rounded text-white m-2 font-500 ">
                  Please be advised that accepting the order is an irreversible
                  action.
                </div>
                <div className="p-1 rounded text-white m-2 font-500 ">
                  <form action="">
                    <input
                      class="form-control form-control-sm my-2"
                      type="text"
                      placeholder="Driver Name"
                      onChange={(e) => setDriverName(e.target.value)}
                    />
                    <input
                      class="form-control form-control-sm my-2"
                      type="text"
                      placeholder="Driver Contact"
                      onChange={(e) => setDriverContact(e.target.value)}
                    />
                    <input
                      class="form-control form-control-sm my-2"
                      type="text"
                      placeholder="Vehicle Number"
                      onChange={(e) => setVehicleNumber(e.target.value)}
                    />
                  </form>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger font-500"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="btn btn-success"
                  data-bs-dismiss="modal"
                  onClick={(e) => acceptOrder(e, selectedOrder)}
                >
                  Accept order
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* reject modal */}
        <div
          className="modal fade font-500"
          id="rejectModal"
          tabIndex="-1"
          aria-labelledby="orderModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered font-500">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fs-4" id="orderModalLabel">
                  Reject Order
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body ">
                <form action="">
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">
                      Description
                    </label>

                    <textarea
                      onChange={(e) => {
                        setRejectDes(e.target.value);
                      }}
                      class="form-control"
                      id="message-text"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  class="btn btn-danger"
                  onClick={(e) => rejectOrder(e, selectedOrder)}
                >
                  Reject Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
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
