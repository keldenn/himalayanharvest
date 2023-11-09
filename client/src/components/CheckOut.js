import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import backgroundImage from "../assets/checkoutimg.png";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../shared/Navbar";
import { json, Link } from "react-router-dom";
import Footer from "../shared/Footer";
function CheckOut({ setAuth, setUser }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dzongkhag, setDzongkhag] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const cartItems = JSON.parse(sessionStorage.getItem("cart")) || [];
  const [farmerId, setFarmerId] = useState("");

  useEffect(() => {
    if (cartItems !== undefined) {
      setFarmerId(cartItems[0].farmer_id);
    }
  }, []);

  const handleSaveAndContinue = async (e) => {
    e.preventDefault();
    try {
      const user_id = sessionStorage.getItem("user_id");
      const body = {
        user_id,
        farmerId,
        cartItems,
        firstName,
        lastName,
        dzongkhag,
        locationDescription,
        date,
        time,
        contactNumber,
      };

      const response = await fetch("http://localhost:5000/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseResponse = await response.json();

      if (response.status == 200) {
        sessionStorage.setItem("cart", JSON.stringify([]));
        toast.success("Order Succesfully Placed", {
          position: "top-center",
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(parseResponse, {
          position: "top-center",
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (err) {
      toast.error("Error!", {
        position: "top-center",
        autoClose: 7000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.error(err.message);
    }
  };

  return (
    <>
      <Navbar setAuth={setAuth} setUser={setUser}></Navbar>
      <div className="d-flex container">
        <div className="w-50 p-5">
          <div className="mb-4">
            <h2 className="font-700 fs-2">Checkout</h2>
            <span className="font-500">Delivery Address</span>
          </div>
          {console.log(cartItems)}
          <div class="row g-3 mb-4">
            <div class="col">
              <input
                type="text"
                class="form-control"
                placeholder="First name"
                aria-label="First name"
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div class="col">
              <input
                type="text"
                class="form-control"
                placeholder="Last name"
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                aria-label="Last name"
              />
            </div>
          </div>
          <div class="mb-4">
            <select
              class="form-select"
              id="dzongkhag"
              value={dzongkhag}
              onChange={(e) => setDzongkhag(e.target.value)}
            >
              <option selected disabled>
                Select Dzongkhag
              </option>
              <option value="Bumthang">Bumthang</option>
              <option value="Chhukha">Chhukha</option>
              <option value="Dagana">Dagana</option>
              <option value="Gasa">Gasa</option>
              <option value="Haa">Haa</option>
              <option value="Lhuentse">Lhuentse</option>
              <option value="Mongar">Mongar</option>
              <option value="Paro">Paro</option>
              <option value="Pemagatshel">Pemagatshel</option>
              <option value="Punakha">Punakha</option>
              <option value="Samdrup Jongkhar">Samdrup Jongkhar</option>
              <option value="Samtse">Samtse</option>
              <option value="Sarpang">Sarpang</option>
              <option value="Thimphu">Thimphu</option>
              <option value="Trashigang">Trashigang</option>
              <option value="Trashiyangtse">Trashiyangtse</option>
              <option value="Trongsa">Trongsa</option>
              <option value="Tsirang">Tsirang</option>
              <option value="Wangdue Phodrang">Wangdue Phodrang</option>
              <option value="Zhemgang">Zhemgang</option>
            </select>
          </div>
          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Location Description"
              id="Location description"
              value={locationDescription}
              onChange={(e) => setLocationDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="date"
              placeholder="Date"
              className="form-control"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="time"
              className="form-control"
              placeholder="Time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="tel"
              className="form-control"
              id="contact-number"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <Link
              className="text-decoration-none text-dark font-400"
              to="/cart"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Go back to cart
            </Link>
            <button
              className="btn btn-success font-600"
              onClick={handleSaveAndContinue}
            >
              Place order
            </button>
          </div>
        </div>
        <div className="w-50 p-5">
          {/* the second child div can contain the order summary or payment options */}

          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              paddingBottom:
                "75%" /* change this value to adjust aspect ratio */,
            }}
          >
            <img
              src={require("../assets/checkoutimg.png")}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>

      <Footer></Footer>
      <ToastContainer
        position="top-center"
        autoClose={7000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default CheckOut;
