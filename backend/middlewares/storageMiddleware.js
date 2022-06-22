const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const storageMiddleware = expressAsyncHandler(async (req, res, next) => {
  const user = req.user;

  const dbUser = await User.findById(user._id);
  const storageConsumption = dbUser.userStorageConsumption;
  if (storageConsumption <= 1024 * 1024) {
    next();
  } else {
    res.status(400).json({ message: "Unable to upload file: No storage left" });
    return;
  }
});

module.exports = { storageMiddleware };
