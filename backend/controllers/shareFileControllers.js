const expressAsyncHandler = require("express-async-handler");
const File = require("../models/fileModel.js");
const User = require("../models/userModel.js");
const { getOriginalFileName } = require("../util/fileUtil.js");

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

const revokeFileAccessController = expressAsyncHandler(async (req, res) => {
  const { fileId, userToRevokeEmail } = req.body;

  if (!userToRevokeEmail) {
    return res.status(400).json({ message: "User cannot be blank" });
  }

  if (!fileId) {
    return res.status(400).json({ message: "FileId cannot be blank" });
  }

  const user = await User.findOne({ userEmail: userToRevokeEmail });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const file = await File.findById(fileId);
  if (!file) {
    return res.status(400).json({ message: "No such file exists" });
  }

  const fileSharedTo = file.fileSharedTo;
  if (fileSharedTo.includes(userToRevokeEmail)) {
    const updatedFileSharedTo = fileSharedTo.filter(
      (value) => value !== userToRevokeEmail
    );
    await File.findByIdAndUpdate(fileId, {
      fileSharedTo: updatedFileSharedTo,
    });
    return res
      .status(201)
      .json({ message: "File access revoked successfully" });
  } else {
    return res.status(201).json({
      message: "The provided user does not have rights to access this file",
    });
  }
});

const getFilesSharedToMeController = expressAsyncHandler(async (req, res) => {
  const me = await User.findById(req.user._id);
  const myEmail = me.userEmail;

  const fileList = await File.find({ fileSharedTo: { $in: [myEmail] } });

  if (!fileList) {
    res.status(400).json({ message: "No files found" });
  } else {
    res.status(201).json({ fileList: fileList });
  }
});

const getFilesSharedByMeController = expressAsyncHandler(async (req, res) => {
  const fileList = await File.find({
    $and: [
      { fileOwner: req.user._id },
      { fileSharedTo: { $exists: true, $not: { $size: 0 } } },
    ],
  });

  fileList.forEach((fileItem)=>{
    fileItem.fileName = getOriginalFileName(fileItem.fileName);
  })

  if (!fileList) {
    res.status(400).json({ message: "No files found" });
  } else {
    res.status(201).json({ fileList: fileList });
  }
});

module.exports = {
  shareFileController,
  revokeFileAccessController,
  getFilesSharedToMeController,
  getFilesSharedByMeController,
};
