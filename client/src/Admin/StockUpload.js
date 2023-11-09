import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const StockUpload = () => {
  const [allFarmers, setAllFarmers] = useState([]);
  const [userId, setUserId] = useState(sessionStorage.getItem("user_id"));
  const [farmerName, setFarmerName] = useState("no name");
  const [product, setProduct] = useState({
    product_name: "",
    product_unit: "",
    product_price: "",
    product_description: "",
    product_category: "",
    stock: "",
    farmer_id: userId,
    farmer_name: farmerName,
    product_image: null,
  });
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
  function getUserNameById(user_id) {
    // console.log("uid", user_id);
    const farmer = allFarmers.find((farmer) => farmer.user_id === user_id);
    return farmer ? farmer.user_name : null;
  }
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setProduct({
      ...product,
      product_image: e.target.files[0],
    });
  };
  const name = getUserNameById(userId);
  // console.log("name", name);
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "product_name",
      product.product_name + " " + product.product_unit
    );
    formData.append("product_price", product.product_price);
    formData.append("product_description", product.product_description);
    formData.append("product_category", product.product_category);
    formData.append("stock", product.stock);
    formData.append("farmer_id", product.farmer_id);
    formData.append("farmer_name", name);
    formData.append("product_image", product.product_image);

    fetch("http://localhost:5000/products/add", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          toast.success(`You have added your product in your bucket!`, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setProduct({
            product_name: "",
            product_unit: "",
            product_price: "",
            product_description: "",
            product_category: "",
            stock: "",
            farmer_id: "",
            farmer_name: "",
            product_image: null,
          });
        } else {
          throw new Error("Error adding product");
        }
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        toast.success(`Failed adding product inside your bucket!`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };
  useEffect(() => {
    getAllFarmers();
    // setFarmerName(getUserNameById(sessionStorage.getItem("user_id")));
  }, []);

  return (
    <div className="container mt-5">
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            name="product_name"
            value={product.product_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Unit</label>
          <input
            type="text"
            className="form-control"
            name="product_unit"
            value={product.product_unit}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Product Price</label>
          <input
            type="number"
            className="form-control"
            name="product_price"
            value={product.product_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Product Category</label>
          <select
            className="form-select"
            name="product_category"
            value={product.product_category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Herbs and Spices">Herbs and Spices</option>
            <option value="Meat and Poultry">Meat and Poultry</option>
            <option value="Dairy Products">Dairy Products</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Product Description</label>
          <textarea
            className="form-control"
            name="product_description"
            value={product.product_description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Product Image</label>
          <input
            type="file"
            className="form-control"
            name="product_image"
            onChange={handleImageChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default StockUpload;
