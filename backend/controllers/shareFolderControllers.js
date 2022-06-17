const expressAsyncHandler = require("express-async-handler");
const Folder = require("../models/folderModel.js");
const User = require("../models/userModel.js");

const shareFolderController = expressAsyncHandler(async (req, res) => {
  const { folderId, userToShareEmail } = req.body;

  if (!userToShareEmail) {
    return res.status(400).json({ message: "User cannot be blank" });
  }

  if (!folderId) {
    return res.status(400).json({ message: "FolderId cannot be blank" });
  }

  const user = await User.findOne({ userEmail: userToShareEmail });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const folder = await Folder.findById(folderId);
  if (!folder) {
    return res.status(400).json({ message: "No such folder exists" });
  }

  const folderSharedTo = folder.folderSharedTo;
  if (!folderSharedTo.includes(userToShareEmail)) {
    const updatedFolderSharedTo = [...folderSharedTo, userToShareEmail];
    await Folder.findByIdAndUpdate(folderId, {
      folderSharedTo: updatedFolderSharedTo,
    });
    return res.status(201).json({ message: "Folder shared successfully" });
  } else {
    return res
      .status(201)
      .json({ message: "User already has access to the file" });
  }
});

const revokeFolderAccessController = expressAsyncHandler(async (req, res) => {
  const { folderId, userToRevokeEmail } = req.body;

  if (!userToRevokeEmail) {
    return res.status(400).json({ message: "User cannot be blank" });
  }

  if (!folderId) {
    return res.status(400).json({ message: "FolderId cannot be blank" });
  }

  const user = await User.findOne({ userEmail: userToRevokeEmail });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const folder = await Folder.findById(folderId);
  if (!folder) {
    return res.status(400).json({ message: "No such folder exists" });
  }

  const folderSharedTo = folder.folderSharedTo;
  if (folderSharedTo.includes(userToRevokeEmail)) {
    const updatedFolderSharedTo = folderSharedTo.filter(
      (value) => value !== userToRevokeEmail
    );
    await Folder.findByIdAndUpdate(folderId, {
      folderSharedTo: updatedFolderSharedTo,
    });
    return res
      .status(201)
      .json({ message: "Folder access revoked successfully" });
  } else {
    return res.status(201).json({
      message: "The provided user does not have rights to access this folder",
    });
  }
});

module.exports = {
  shareFolderController,
  revokeFolderAccessController,
};
