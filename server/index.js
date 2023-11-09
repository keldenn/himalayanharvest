const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");
//Middleware
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

async function sendEmail(to, subject, html) {
  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    secure: true,
    port: 465,
    auth: {
      user: "sanamtshongpoen@zohomail.com",
      pass: "kelden509K$",
    },
  });

  await transporter.sendMail({
    from: "sanamtshongpoen@zohomail.com",
    to: to,
    subject: subject,
    html: html,
  });
}

//Routes
app.post("/otp", async (req, res) => {
  const { type, name, contact, email, password, confirmPassword } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    await sendEmail(email, "OTP", `<b>${otp}</b> otp code`);

    res.status(200).send(otp.toString());
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

// routes
app.use("/auth", require("./routes/jwtAuth"));
app.use("/orders", require("./routes/orders"));
app.use("/users", require("./routes/users"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/products", require("./routes/products"));
app.use("/wishlist", require("./routes/wishlist"));

let port = process.env.port || 5000;
app.listen(port, () => {
  console.log("server currently running on port " + port);
});
