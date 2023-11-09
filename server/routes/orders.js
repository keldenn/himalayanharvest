const router = require("express").Router();
const pool = require("../db");
const validateCheckout = require("../middleware/checkoutValid");
//Place order after checkout
router.post("/checkout", validateCheckout, async (req, res) => {
  try {
    const {
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
    } = req.body;

    let newCartItems = cartItems;
    newCartItems.forEach((item, index) => {
      newCartItems[index] = JSON.stringify(item);
    });

    const order = await pool.query(
      "INSERT INTO orders (user_id, farmer_id, order_status, cart_items, first_name, last_name, dzongkhag, location_description, date, time, contact_number,reject_des, driver_name, driver_contact, vehicle_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *",
      [
        user_id,
        farmerId,
        "pending",
        JSON.stringify(cartItems),
        firstName,
        lastName,
        dzongkhag,
        locationDescription,
        date,
        time,
        contactNumber,
        "",
        "",
        "",
        "",
      ]
    );

    res.status(200).json(order.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

//get all ordrdes

router.get("/all", async (req, res) => {
  try {
    const orders = await pool.query("select * from orders;");
    if (orders.rowCount === 0) {
      res.status(404).json("no orders found");
    }
    res.status(200).json(orders.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/:farmer_id", async (req, res) => {
  const { farmer_id } = req.params;
  try {
    const orders = await pool.query(
      "SELECT * FROM orders WHERE farmer_id = $1",
      [farmer_id]
    );
    if (orders.rowCount === 0) {
      res.status(404).json("No orders found for this farmer.");
    }
    res.status(200).json(orders.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//pending orders for specific farmer
router.get("/:farmer_id/pending", async (req, res) => {
  const { farmer_id } = req.params;
  try {
    const orders = await pool.query(
      "SELECT * FROM orders WHERE farmer_id = $1 and order_status =$2 ",
      [farmer_id, "pending"]
    );
    if (orders.rowCount === 0) {
      res.status(404).json("No orders found for this farmer.");
    }
    res.status(200).json(orders.rows);
  } catch (err) {
    console.error(err.message);
  }
});
//accepted
router.get("/:farmer_id/accepted", async (req, res) => {
  const { farmer_id } = req.params;
  try {
    const orders = await pool.query(
      "SELECT * FROM orders WHERE farmer_id = $1 and order_status = $2  or order_status = $3",
      [farmer_id, "accepted", "rejected"]
    );
    if (orders.rowCount === 0) {
      res.status(404).json("No orders found for this farmer.");
    }
    res.status(200).json(orders.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// update driver details after accept

router.post("/update/accepted", async (req, res) => {
  try {
    const { orderID, driverName, driverContact, vehicleNumber } = req.body;
    const orders = await pool.query(
      "UPDATE orders SET driver_name = $1, driver_contact = $2, vehicle_number = $3, order_status = $4 WHERE order_id = $5 RETURNING *",
      [driverName, driverContact, vehicleNumber, "accepted", orderID]
    );
    if (orders.rowCount !== 0) {
      res.status(200).json("Order accepted!");
    } else {
      res.status(402).json("Cannot be accepted");
    }
  } catch (err) {
    console.error(err.message);
  }
});
router.post("/update/rejected", async (req, res) => {
  try {
    const { orderID, rejectDes } = req.body;
    const orders = await pool.query(
      "UPDATE orders SET reject_des = $1, order_status = $2 WHERE order_id = $3 RETURNING *",
      [rejectDes, "rejected", orderID]
    );
    if (orders.rowCount !== 0) {
      res.status(200).json("Order has been rejected");
    } else {
      res.status(402).json("Cannot be rejected");
    }
  } catch (err) {
    console.error(err.message);
  }
});
router.post("/delete/:order_id", async (req, res) => {
  try {
    const { order_id } = req.params;
    const orders = await pool.query("delete from orders where order_id = $1", [
      order_id,
    ]);
    res.status(200).json("Order deleted!");
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const orders = await pool.query("SELECT * FROM orders WHERE user_id = $1", [
      user_id,
    ]);
    if (orders.rowCount === 0) {
      res.status(404).json("No orders found for this user.");
    }
    res.status(200).json(orders.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/user/:user_id/pending", async (req, res) => {
  const { user_id } = req.params;
  try {
    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 and order_status =$2 ",
      [user_id, "pending"]
    );
    if (orders.rowCount === 0) {
      res.status(404).json("No orders found for this user.");
    }
    res.status(200).json(orders.rows);
  } catch (err) {
    console.error(err.message);
  }
});
//accepted
router.get("/user/:user_id/accepted", async (req, res) => {
  const { user_id } = req.params;
  try {
    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 and order_status = $2",
      [user_id, "accepted"]
    );
    // if (orders.rowCount === 0) {
    //   res.status(404).json("No orders found for this user.");
    // }
    res.status(200).json(orders.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/user/:user_id/rejected", async (req, res) => {
  const { user_id } = req.params;
  try {
    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 and order_status = $2",
      [user_id, "rejected"]
    );
    if (orders.rowCount === 0) {
      res.status(404).json("No orders found for this user.");
    }
    res.status(200).json(orders.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
