import React, { useEffect, useState } from "react";

const StockUpdate = () => {
  const [products, setProducts] = useState([]);

  const handleStockChange = async (productId, newStock) => {
    try {
      // Update the stock locally
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.product_id === productId
            ? { ...product, stock: newStock }
            : product
        )
      );

      // Make the HTTP request to update the stock on the server
      await fetch(`http://localhost:5000/products/update/stock/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: newStock }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      // Remove the product locally

      // Make the HTTP request to delete the product from the server
      await fetch(`http://localhost:5000/products/delete/${productId}`, {
        method: "DELETE",
      });
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.product_id !== productId)
      );
    } catch (error) {
      console.error(error);
    }
  };
  const farmer_id = sessionStorage.getItem("user_id");
  async function getProducts() {
    try {
      const response = await fetch(
        `http://localhost:5000/products/${farmer_id}`,
        {
          method: "GET",
        }
      );

      const productsRes = await response.json();
      // undefined
      setProducts(productsRes);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <div className="container">
      <div className="row">
        {console.log(products)}
        {products.map((product) => (
          <div className="col-md-4" key={product.product_id}>
            <div className="card">
              <img
                src={require("../../../server/public/images/" +
                  product.product_image)}
                className="card-img-top p-5"
              />
              <div className="card-body">
                <h5 className="card-title">{product.product_name}</h5>
                <p className="card-text">
                  Category: {product.product_category}
                </p>
                <p className="card-text">Price: ${product.product_price}</p>
                <p className="card-text">Available Stock: {product.stock}</p>
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    value={product.stock}
                    onChange={(e) =>
                      handleStockChange(
                        product.product_id,
                        parseInt(e.target.value)
                      )
                    }
                    min="0"
                  />
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteProduct(product.product_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockUpdate;
