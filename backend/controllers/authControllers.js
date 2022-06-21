const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../config/tokenGenerator.js");
const Folder = require("../models/folderModel.js");
const User = require("../models/userModel.js");

const signupUserController = expressAsyncHandler(async (req, res) => {
  const { userName, userEmail, userPassword } = req.body;

  if (!userName) {
    res.status(400).json({
      message: "Username cannot be blank",
    });
    return;
  }

  if (!userEmail) {
    res.status(400).json({
      message: "Email cannot be blank",
    });
    return;
  }

  if (!userPassword) {
    res.status(400).json({
      message: "Password cannot be blank",
    });
    return;
  }

  const userExists = await User.findOne({ userEmail });

  if (userExists) {
    res
      .status(400)
      .json({ message: "User with provided email already exists" });
    return;
  }

  const userStorageConsumption = "0";

  const userDataFolderTempValue = null; // Initially set user data folder to null

  const user = await User.create({
    userName,
    userEmail,
    userPassword,
    userStorageConsumption,
    userDataFolderTempValue,
  });

  if (user) {
    const userFolder = await Folder.create({
      folderName: `${user.userName}_root`,
      folderOwner: user._id,
      folderSharedTo: [],
      folderParentDirectory: [],
    });

    user.userDataFolder = userFolder._id;

    await User.findByIdAndUpdate(user._id, { user });

    res.status(201).json({
      _id: user._id,
      userName: user.userName,
      userEmail: user.userEmail,
      userDataFolder: user.userDataFolder,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "An unknown error occurred" });
    return;
  }
});

const loginUserController = expressAsyncHandler(async (req, res) => {
  const { userEmail, userPassword } = req.body;

  if (!userEmail) {
    res.status(400).json({
      message: "Email cannot be blank",
    });
    return;
  }

  if (!userPassword) {
    res.status(400).json({
      message: "Password cannot be blank",
    });
    return;
  }

  const dbUser = await User.findOne({ userEmail });

  if (dbUser) {
    if (await dbUser.matchPassword(userPassword)) {
      res.status(201).json({
        _id: dbUser._id,
        userName: dbUser.userName,
        userEmail: dbUser.userEmail,
        userDataFolder: dbUser.userDataFolder,
        token: generateToken(dbUser._id),
      });
    } else {
      res.status(400).json({
        message: "Incorrect Password",
      });
      return;
    }
  } else {
    res.status(400).json({
      message: "No user with the provided email exists",
    });
    return;
  }
});

module.exports = { signupUserController, loginUserController };
