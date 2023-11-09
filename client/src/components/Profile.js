import React from "react";
import { Fragment, useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { Link } from "react-router-dom";
import { parse } from "@fortawesome/fontawesome-svg-core";
import { toast, ToastContainer } from "react-toastify";

function Profile({ setAuth, setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const user_id = sessionStorage.getItem("user_id");

  async function fetchUserData() {
    try {
      const response = await fetch(`http://localhost:5000/users/${user_id}`, {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parseRes = await response.json();
      setName(parseRes[0].user_name);
      setEmail(parseRes[0].user_email);
      setContact(parseRes[0].user_contact);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function handleSaveChanges(e) {
    e.preventDefault();

    try {
      const body = {
        name,
        contact,
        email,
        currentPassword,
        newPassword,
        confirmPassword,
      };

      const response = await fetch(
        `http://localhost:5000/users/customer/update/${user_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const parseResponse = await response.json();
      if (response.status == 200) {
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

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <Fragment>
      <Navbar setAuth={setAuth} setUser={setUser}></Navbar>
      <section>
        {" "}
        <div className="container my-5 ">
          <h5 className="text-center font-500" style={{ fontSize: 16 }}>
            Welcome back <span className="text-success">{name}</span>
          </h5>

          <div className="row py-5">
            <div className="col-md-4 d-flex flex-column">
              <Link
                className="text-decoration-none text-success font-700 my-3 fs-5"
                to="/profile"
              >
                Manage My Account
              </Link>
              <Link
                className="text-decoration-none text-dark font-700 my-3 fs-5"
                to="/trackorders"
              >
                My Orders
              </Link>
              <Link
                className="text-decoration-none text-dark font-700 my-3 fs-5"
                to="/wishlist"
              >
                My Wishlist
              </Link>
            </div>
            <div className="col-md-8">
              <h3 className="font-700">Edit your profile</h3>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="contact" className="form-label">
                    Contact
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="current-password" className="form-label">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="new-password" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirm-password" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
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

export default Profile;
