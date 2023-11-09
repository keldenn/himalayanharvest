const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const validInfo = require("../middleware/validInfo");

router.get("/farmers", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users WHERE user_type = 1");

    res.status(200).json(users.rows);
  } catch (err) {
    res.status(500).json("Server Error");
  }
});
router.get("/:farmer_id/name", async (req, res) => {
  const { farmer_id } = req.params;
  try {
    const users = await pool.query(
      "SELECT * FROM users WHERE user_type = 1 and user_id = $1",
      [farmer_id]
    );

    res.status(200).json(users.rows[0].user_name);
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users where user_type = 0");
    res.status(200).json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("SERVER ERR");
  }
});

router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const users = await pool.query("SELECT * FROM users where user_id = $1", [
      user_id,
    ]);
    res.status(200).json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("SERVER ERR");
  }
});

router.post("/customer/update/:user_id", async (req, res) => {
  try {
    const {
      name,
      contact,
      email,
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;
    const { user_id } = req.params;

    //user query
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      user_id,
    ]);

    // check if current password is valid
    const passwordValid = await bcrypt.compare(
      currentPassword,
      user.rows[0].user_password
    );

    if (!passwordValid) {
      return res.status(401).json("Incorrect password.");
    }
    //check if the new and confirm password is same
    if (newPassword !== confirmPassword) {
      return res.status(401).json("Password do not match!");
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await pool.query(
      "UPDATE users SET user_type =  $1, user_name = $2, user_contact = $3, user_email = $4, user_password = $5 WHERE user_Id = $6 RETURNING *",
      [0, name, contact, email, bcryptPassword, user_id]
    );

    res.status(200).json("User Details Updated!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("SERVER ERR");
  }
});

module.exports = router;
