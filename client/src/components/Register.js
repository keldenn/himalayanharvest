import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
// import { Checkbox, CheckboxGroup } from "rsuite";
// import CheckboxGroup from "react-checkbox-group";

const Register = ({ setAuth, setUser }) => {
  const [isFarmer, setIsFarmer] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);
  const [otp, setOtp] = useState(null);
  const [userOtp, setUserOtp] = useState(null);

  const [inputs, setInputs] = useState({
    type: "",
    name: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { type, name, contact, email, password, confirmPassword } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const sendOtp = async (e) => {
    e.preventDefault();
    const body = { email };
    try {
      const response = await fetch("http://localhost:5000/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      response.text().then((text) => {
        setOtp(text);
      });
    } catch (error) {
      console.err(error.message);
    }
  };
  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (userOtp === otp) {
      try {
        const body = { type, name, contact, email, password, confirmPassword };
        // console.log(body);
        const response = await fetch("http://localhost:5000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const parseResponse = await response.json();
        console.log(parseResponse);
        if (parseResponse.token) {
          localStorage.setItem("token", parseResponse.token);

          setAuth(true);
          setUser(JSON.parse(sessionStorage.getItem("token")));

          sessionStorage.setItem("token", JSON.stringify(parseResponse.token));
          sessionStorage.setItem("user_id", parseResponse.id);
          setUser(JSON.parse(sessionStorage.getItem("token")));

          toast.success(
            `Welcome to Himalayan Harvest, ${parseResponse.name
              .charAt(0)
              .toUpperCase()}${parseResponse.name.substring(1)}!`,
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
        } else {
          setAuth(false);
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
    } else {
      toast.error("OTP does not match!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.log("OTP does not match!");
    }
  };

  return (
    <Fragment>
      {console.log(otp)}
      <div className="container d-flex justify-content-center align-items-center h-100 w-100 ">
        <div className="container w-auto px-5 pb-4 pt-1 rounded shadow-lg">
          <h1 className="text-center my-5">Register</h1>
          <form>
            <input
              className="form-control my-3"
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => onChange(e)}
            />
            <input
              className="form-control my-3"
              type="text"
              name="contact"
              placeholder="Contact"
              value={contact}
              onChange={(e) => onChange(e)}
            />
            <input
              className="form-control my-3"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => onChange(e)}
            />

            <input
              className="form-control my-3"
              type="password"
              name="password"
              placeholder="Passoword"
              value={password}
              onChange={(e) => onChange(e)}
            />
            <input
              className="form-control my-3"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Passoword"
              value={confirmPassword}
              onChange={(e) => onChange(e)}
            />
            <div className="my-3 row mx-1">
              <div class="form-check form-check-inline col-md-6 col-lg-auto d-flex align-content-center">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="type"
                  value="0"
                  checked={isCustomer}
                  onChange={(e) => {
                    onChange(e);
                    setIsFarmer(false);
                    setIsCustomer(true);
                  }}
                />
                <label class="form-check-label" for="inlineCheckbox1">
                  Customer
                </label>
              </div>

              <div class="form-check form-check-inline col-md-6 col-lg-auto d-flex align-content-center">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="type"
                  value="1"
                  checked={isFarmer}
                  onChange={(e) => {
                    onChange(e);
                    setIsFarmer(true);
                    setIsCustomer(false);
                  }}
                />
                <label class="form-check-label" for="inlineCheckbox2">
                  Farmer
                </label>
              </div>
            </div>
          </form>
          {/* 
         OTP modal
         
         */}

          <button
            type="button"
            className="btn text-white btn-block my-2"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            style={{ backgroundColor: "#3BB77E" }}
            onClick={async (e) => {
              await sendOtp(e);
            }}
          >
            Continue
          </button>

          <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    OTP
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <p>
                    OTP has been sent to your mail <b>{email}</b>
                  </p>
                  <form>
                    <input
                      type="text"
                      className="form-control"
                      name="otp"
                      value={userOtp}
                      onChange={(e) => setUserOtp(e.target.value)}
                    />
                  </form>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={onSubmitForm}
                    class="btn btn-success"
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-3">
            <p className="fs-6">
              Already a user?
              <Link
                class="text-dark text-decoration-none"
                // style={{ color: "white" }}
                to="/"
              >
                <b style={{ color: "#3BB77E" }}> Login</b>
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* bootstrap form */}
    </Fragment>
  );
};
export default Register;
