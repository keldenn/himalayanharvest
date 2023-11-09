const router = require("express").Router();
const pool = require("../db");

//get all wishlist
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT products FROM wishlist WHERE user_id = $1",
      [req.params.id]
    );
    // if(rows.rowCount === undefined){
    //     res.status(404).json({message: "no Items found in wishlist"})
    // }
    if (rows.rowCount === 0) {
      return res.status(401).json({ message: "no Items in wishlist!" });
    }
    res.json(rows[0]["products"]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//delete a wishlist
router.delete("/:id/:product_id", async (req, res) => {
  try {
    const wishlist = await pool.query(
      "SELECT * FROM wishlist WHERE user_id = $1",
      [req.params.id]
    );

    // Check if the user has a wishlist
    if (wishlist.rows.length === 0) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const products = wishlist.rows[0].products;

    if (Object.keys(products).length === 0) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    // Check if the product exists in the wishlist
    const productIndex = products.findIndex(
      (p) => p.product_id === req.params.product_id
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    // Remove the product from the wishlist
    products.splice(productIndex, 1);

    // Update the wishlist in the database

    const updatedWL = await pool.query(
      "UPDATE wishlist SET products = $1 WHERE user_id = $2 RETURNING *",
      [JSON.stringify(products), req.params.id]
    );

    res.json(updatedWL.rows[0]["products"]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// add a product to your wishlist
router.post("/:id/:product_id", async (req, res) => {
  try {
    const { id, product_id } = req.params;

    // Check if the user has a wishlist
    const wishlist = await pool.query(
      "SELECT * FROM wishlist WHERE user_id = $1",
      [id]
    );

    if (wishlist.rowCount === 0) {
      // If user does not have a wishlist, create a new one
      console.log("hi");
      await pool.query(
        "INSERT INTO wishlist (user_id, products) VALUES ($1, $2)",
        [id, JSON.stringify([])]
      );

      const product = await pool.query(
        "SELECT * FROM products WHERE product_id = $1",
        [product_id]
      );

      if (product.rows[0].length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Add the product to the wishlist

      const newProduct = {
        product_id: product_id,
        product_name: product.rows[0].product_name,
        product_price: product.rows[0].product_price,
        product_description: product.rows[0].product_description,
        product_image: product.rows[0].product_image,
        product_category: product.rows[0].product_category,
        stock: product.rows[0].stock,
        times_ordered: product.rows[0].times_ordered,
        farmer_id: product.rows[0].farmer_id,
        farmer_name: product.rows[0].farmer_name,
      };

      const updatedProducts = [newProduct];

      // Update the wishlist in the database
      const updatedWL = await pool.query(
        "UPDATE wishlist SET products = $1 WHERE user_id = $2 RETURNING *",
        [JSON.stringify(updatedProducts), id]
      );

      res.json(updatedWL.rows[0]["products"]);
    }

    // Check if the product is already in the wishlist
    const products = Array.isArray(wishlist.rows[0].products)
      ? wishlist.rows[0].products
      : [];

    if (products.some((product) => product.product_id === product_id)) {
      return res
        .status(400)
        .json({ message: "Product is already in the wishlist" });
    }

    // Get the product details from the products table
    const product = await pool.query(
      "SELECT * FROM products WHERE product_id = $1",
      [product_id]
    );

    if (product.rows[0].length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add the product to the wishlist

    const newProduct = {
      product_id: product_id,
      product_name: product.rows[0].product_name,
      product_price: product.rows[0].product_price,
      product_description: product.rows[0].product_description,
      product_image: product.rows[0].product_image,
      product_category: product.rows[0].product_category,
      stock: product.rows[0].stock,
      times_ordered: product.rows[0].times_ordered,
      farmer_id: product.rows[0].farmer_id,
      farmer_name: product.rows[0].farmer_name,
    };

    const updatedProducts = [...products, newProduct];

    // Update the wishlist in the database
    const updatedWL = await pool.query(
      "UPDATE wishlist SET products = $1 WHERE user_id = $2",
      [JSON.stringify(updatedProducts), id]
    );
    updatedWL.rows[0]["products"]
      ? res.json(updatedWL.rows[0]["products"])
      : res.json(updatedWL.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
