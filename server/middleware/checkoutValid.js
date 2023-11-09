// Middleware function for complete validation
module.exports = function (req, res, next) {
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

  // Validate user_id, farmerId, cartItems, firstName, lastName, dzongkhag, locationDescription, date, time, contactNumber
  if (
    !user_id ||
    !farmerId ||
    !Array.isArray(cartItems) ||
    cartItems.length === 0 ||
    !firstName ||
    !lastName ||
    !dzongkhag ||
    !locationDescription ||
    !date ||
    !time ||
    !contactNumber
  ) {
    return res.status(400).json("Invalid request parameters");
  }

  // Validate date (check if it's not before the current date)
  const currentDate = new Date();
  const selectedDate = new Date(date);

  if (selectedDate < currentDate) {
    return res.status(400).json("Invalid date");
  }

  // Additional validation checks can be added as per your requirements

  // If all validations pass, move to the next middleware or route handler
  next();
};
