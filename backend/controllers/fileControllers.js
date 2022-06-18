const expressAsyncHandler = require("express-async-handler");
const File = require("../models/fileModel.js");
const User = require("../models/userModel.js");
const { getOriginalFileName, renameFile } = require("../util/fileUtil.js");

const createFileController = expressAsyncHandler(async (req, res) => {
  const { fileDirectory } = req.body;

  if (!req.files) {
    res.status(400).json({
      message: "File data cannot be blank",
    });
    return;
  }

  if (!fileDirectory) {
    res.status(400).json({
      message: "File directory cannot be blank",
    });
    return;
  }

  let file = req.files[0];

  const fileName = file.key;
  const fileStorageUrl = file.location;
  const fileType = file.mimetype;
  const fileSize = file.size;
  const fileOwner = req.user._id;
  const fileSharedTo = [];

  let uploadedFile = await File.create({
    fileName,
    fileStorageUrl,
    fileType,
    fileSize,
    fileOwner,
    fileSharedTo,
    fileDirectory,
  });

  uploadedFile = await uploadedFile.populate("fileOwner", "-userPassword");
  uploadedFile = await uploadedFile.populate("fileDirectory");

  // Updated storage consumption in user schema
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(400).json({
      message: "No user found",
    });
  } else {
    const currentStorageConsumption = user.userStorageConsumption;
    const updatedStorageConsumption =
      parseInt(currentStorageConsumption) + parseInt(fileSize);
    await User.findByIdAndUpdate(req.user._id, {
      userStorageConsumption: updatedStorageConsumption,
    });
  }

  if (uploadedFile) {
    res.status(201).json({ file: uploadedFile });
  } else {
    res.status(400);
    throw new Error("An unknown error occurred");
  }
});

const getFilesInFolderController = expressAsyncHandler(async (req, res) => {
  let { fileDirectory } = req.body;

  if (!fileDirectory) {
    fileDirectory = null;
  }

  let fileList = await File.find({
    $and: [{ fileDirectory: fileDirectory }, { fileOwner: req.user._id }],
  }).populate("fileOwner", "-userPassword");

  if (fileList) {
    fileList.forEach((fileItem) => {
      fileItem.fileName = getOriginalFileName(fileItem.fileName);
    });

    res.status(201).json({
      fileList: fileList,
    });
  } else {
    res.status(400).json({
      message: "File not found",
    });
    return;
  }
});

const renameFileController = expressAsyncHandler(async (req, res) => {
  let { fileId, newName } = req.body;

  if (!fileId) {
    return res.status(400).json({ message: "FileId cannot be blank" });
  }

  if (!newName) {
    return res.status(400).json({ message: "File name cannot be blank" });
  }

  const file = await File.findById(fileId);
  if (!file) {
    return res.status(400).json({ message: "File not found" });
  }

  const updatedName = renameFile(file.fileName, newName);

  try {
    await File.findByIdAndUpdate(fileId, { fileName: updatedName });
    return res.status(201).json({ message: "Success" });
  } catch (e) {
    return res.status(400).json({ message: "An unknown error occurred" });
  }
});

const searchFilesUsingNameController = expressAsyncHandler(async (req, res) => {
  const { fileNameQuery } = req.body;

  if (!fileNameQuery) {
    res.status(400).json({ message: "File name query cannot be blank" });
  }

  // Get all files of that user
  const fileList = await File.find({ fileOwner: req.user._id }).populate(
    "fileOwner",
    "-userPassword"
  );

  // Declare an empty array to store files
  let filteredFileList = [];

  if (fileList) {
    fileList.forEach((fileItem) => {
      // Convert the filename to its original form
      fileItem.fileName = getOriginalFileName(fileItem.fileName);

      if (fileItem.fileName.includes(fileNameQuery)) {
        filteredFileList.push(fileItem);
      }
    });

    res.status(201).json({
      fileList: filteredFileList,
    });
  } else {
    res.status(400).json({
      message: "File not found",
    });
    return;
  }
});

const searchFilesUsingTypeController = expressAsyncHandler(async (req, res) => {
  const { fileTypeQuery } = req.body;

  let fileList = await File.find({
    $and: [
      { fileType: { $regex: fileTypeQuery, $options: "i" } },
      { fileOwner: req.user._id },
    ],
  }).populate("fileOwner", "-userPassword");

  if (fileList) {
    fileList.forEach((fileItem) => {
      fileItem.fileName = getOriginalFileName(fileItem.fileName);
    });

    res.status(201).json({
      fileList: fileList,
    });
  } else {
    res.status(400).json({
      message: "File not found",
    });
    return;
  }
});

const getTotalStorageConsumptionController = expressAsyncHandler(
  async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ message: "No user found" });
    } else {
      // Return storage conmsumption in megabytes (Mb)
      const storageConsumption = (
        user.userStorageConsumption / 1000000
      ).toFixed(2);
      return res.status(201).json({ storageConsumption: storageConsumption });
    }
  }
);

module.exports = {
  createFileController,
  getFilesInFolderController,
  renameFileController,
  searchFilesUsingNameController,
  searchFilesUsingTypeController,
  getTotalStorageConsumptionController,
};
