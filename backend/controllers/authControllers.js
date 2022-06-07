const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../config/tokenGenerator.js");
const User = require("../models/userModel.js");

const signupUserController = expressAsyncHandler(async (req, res) => {
  const { userName, userEmail, userPassword, userProfilePicture } = req.body;

  if(!userName) {
    res.status(400).json({
      message: "Username cannot be blank"
    });
    return;
  }

  if(!userEmail) {
    res.status(400).json({
      message: "Email cannot be blank"
    });
    return;
  }
  if(!userPassword) {
    res.status(400).json({
      message: "Password cannot be blank"
    });
    return;
  }




  const userExists = await User.findOne({ userEmail });

  if (userExists) {
    res.status(400);
    throw new Error("User with the provided email already exists");
  }

  const user = await User.create({
    userName,
    userEmail,
    userPassword,
    userProfilePicture,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      userName: user.userName,
      userEmail: user.userEmail,
      userProfilePicture: user.userProfilePicture,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("An unknown error occurred");
  }
});

module.exports = { signupUserController };
