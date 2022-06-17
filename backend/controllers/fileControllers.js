const expressAsyncHandler = require("express-async-handler");
const File = require("../models/fileModel.js");

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

  let uploadedFile = await File.create({
    fileName,
    fileStorageUrl,
    fileType,
    fileSize,
    fileOwner,
    fileDirectory,
  });

  uploadedFile = await uploadedFile.populate("fileOwner", "-userPassword");
  uploadedFile = await uploadedFile.populate("fileDirectory");

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

module.exports = {
  createFileController,
  getFilesInFolderController,
};
