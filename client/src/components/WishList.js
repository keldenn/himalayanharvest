import React, { useState, useEffect, Fragment } from "react";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

function WishlistPage({ setUser }) {
  const [wishlist, setWishlist] = useState([]);
  const [render, setRender] = useState(true);
  const user_id = sessionStorage.getItem("user_id");

  //   Fetch wishlist from server on component mount
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
        setWishlist(wishlistRes);
      }
    } catch (err) {
      console.error(err.message);
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

      setWishlist(updatedWishlist);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Fragment>
      <Navbar setUser={setUser}></Navbar>

      <div className="container my-5 py-2">
        <h1>My Wishlist</h1>
        {wishlist.length === 0 ? (
          <div>You have no items in your wishlist.</div>
        ) : (
          <div className="row row-cols-1 row-cols-md-4 g-4">
            {wishlist.map((item) => (
              <div key={item.product_id} className="col">
                <div className="card">
                  <img
                    src={require("../../../server/public/images/" +
                      item.product_image)}
                    className="card-img-top"
                    alt={item.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.product_name}</h5>
                    <p className="card-text">
                      {item.description}
                      <br />
                      <small className="text-muted">
                        Price: BTN {item.product_price}
                      </small>
                    </p>
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        deleteProductFromWishlist(item.product_id, user_id)
                      }
                    >
                      Remove from Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer></Footer>
    </Fragment>
  );
}

export default WishlistPage;
