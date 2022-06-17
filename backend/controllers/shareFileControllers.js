const expressAsyncHandler = require("express-async-handler");
const File = require("../models/fileModel.js");
const User = require("../models/userModel.js");

const shareFileController = expressAsyncHandler(async (req, res) => {
  const { fileId, userToShareEmail } = req.body;

  if (!userToShareEmail) {
    return res.status(400).json({ message: "User cannot be blank" });
  }

  if (!fileId) {
    return res.status(400).json({ message: "FileId cannot be blank" });
  }

  const user = await User.findOne({ userEmail: userToShareEmail });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const file = await File.findById(fileId);
  if (!file) {
    return res.status(400).json({ message: "No such file exists" });
  }

  const fileSharedTo = file.fileSharedTo;
  if (!fileSharedTo.includes(userToShareEmail)) {
    const updatedFileSharedTo = [...fileSharedTo, userToShareEmail];
    await File.findByIdAndUpdate(fileId, {
      fileSharedTo: updatedFileSharedTo,
    });
    return res.status(201).json({ message: "File shared successfully" });
  } else {
    return res
      .status(201)
      .json({ message: "User already has access to the file" });
  }
});

module.exports = { shareFileController };
