import { parse } from "@fortawesome/fontawesome-svg-core";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const Login = ({ setAuth, setUser, setAdmin }) => {
  const [isFarmer, setIsFarmer] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);
  const [inputs, setInputs] = useState({
    type: "",
    email: "",
    password: "",
  });

  const { email, password, type } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password, type };
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      console.log(parseRes);
      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        if (parseRes.user_type == "1") {
          setAdmin(true);
          sessionStorage.setItem("admin", true);
        }
        sessionStorage.setItem("token", JSON.stringify(parseRes.token));
        sessionStorage.setItem("user_id", parseRes.id);
        setUser(JSON.parse(sessionStorage.getItem("token")));

        toast.success(
          `Welcome Back, ${parseRes.name
            .charAt(0)
            .toUpperCase()}${parseRes.name.substring(1)}!`,
          {
            position: "top-center",
            autoClose: 2500,
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
        if (response.status === 403) {
          toast.warning(parseRes, {
            position: "top-center",
            autoClose: 2500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } else {
          toast.error(parseRes, {
            position: "top-center",
            autoClose: 2500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <div className="container d-flex justify-content-center align-items-center h-100 w-100 ">
        <div className="container w-auto px-5 pb-4 pt-1 rounded shadow-lg">
          <h1 className="text-center my-5">Login</h1>
          <form onSubmit={onSubmitForm}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control my-3"
              value={email}
              onChange={(e) => onChange(e)}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control my-3"
              value={password}
              onChange={(e) => onChange(e)}
            />
            <div className="my-3 row mx-1">
              <div class="form-check form-check-inline col-sm-6 col-md-auto d-flex align-items-center">
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

              <div class="form-check form-check-inline col-sm-6 col-md-auto d-flex align-items-center">
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

            <button
              className="btn btn-block text-white"
              style={{ backgroundColor: "#3BB77E" }}
            >
              Submit
            </button>
          </form>
          <div class="text-center mt-3">
            <p className="fs-6">
              <Link
                to="/register"
                className="text-decoration-none text-dark mt-3"
              >
                Not a user? <b style={{ color: "#3BB77E" }}>Register</b>
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
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
};

export default Login;
