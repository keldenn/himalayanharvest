const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const multer = require("multer");
const path = require("path");
//get all products
router.get("/", authorization, async (req, res) => {
  try {
    //req.user has the payload
    // res.json(req.user);
    const products = await pool.query("SELECT * FROM products");
    const users = await pool.query("SELECT * FROM users");

    res.status(200).json({
      user: users.rows,
      product: products.rows,
    });
  } catch (err) {
    res.status(500).json("Server Error");
  }
});
router.get("/all", async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM products");

    res.status(200).json(products.rows);
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

//get featured products
router.get("/featured", async (req, res) => {
  try {
    const featuredProducts = await pool.query(
      "select * from products order by times_ordered desc limit 4"
    );
    res.status(200).json(featuredProducts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500);
  }
});

//get products by category
router.get("/getproduct/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const categoryProducts = await pool.query(
      "select * from products where product_category = $1",
      [category]
    );
    if (categoryProducts.rowCount == 0) {
      return res
        .status(404)
        .json({ messgae: "No products found in this category" });
    }
    res.status(200).json(categoryProducts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json();
  }
});

// get a product
router.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await pool.query(
      "SELECT * FROM products WHERE product_id = $1",
      [id]
    );
    if (product.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// get products by farmer
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await pool.query(
      "SELECT * FROM products WHERE farmer_id = $1",
      [id]
    );

    res.status(200).json(product.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// const upload = multer({ dest: "public/images" });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Init upload middleware
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("product_image");

// Check file type function
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images only!");
  }
}

router.post("/add", upload, async (req, res) => {
  try {
    const {
      product_name,
      product_price,
      product_description,
      product_category,
      stock,
      farmer_id,
      farmer_name,
    } = req.body;

    // Insert product data into the database
    const query = `
      INSERT INTO products (product_name, product_price, product_description, product_image, product_category, stock, times_ordered, farmer_id, farmer_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [
      product_name,
      product_price,
      product_description,
      req.file.filename,
      product_category,
      stock,
      0, // times_ordered initialized to 0
      farmer_id,
      farmer_name,
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//REMOVE A PRODUCT
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = await pool.query(
      "DELETE FROM products WHERE product_id = $1",
      [id]
    );

    res.json("Delete success!");
  } catch (err) {
    console.error(err.message);
  }
});

router.post("/update/stock/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const query = await pool.query(
      "UPDATE products SET stock = $1 where product_id = $2",
      [stock, id]
    );
    res.json(query.rows);
  } catch (err) {
    console.error(err.message);
  }
});
module.exports = router;
