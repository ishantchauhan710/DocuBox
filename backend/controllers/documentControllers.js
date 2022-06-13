const expressAsyncHandler = require("express-async-handler");
const path = require("path");
const File = require("../models/fileModel.js");
const Folder = require("../models/folderModel.js");

// *********************** Folder Controllers ************************/

const createFolderController = expressAsyncHandler(async (req, res) => {
  let { folderName, folderParentDirectory } = req.body;

  if (!folderName) {
    res.status(400).json({
      message: "Folder name cannot be blank",
    });
    return;
  }

  if (!folderParentDirectory) {
    folderParentDirectory = null;
  }

  const folderOwner = req.user._id;

  let folder = await Folder.create({
    folderName,
    folderOwner,
    folderParentDirectory,
  });

  folder = await folder.populate("folderOwner", "-userPassword");
  folder = await folder.populate("folderParentDirectory");

  if (folder) {
    res.status(201).json({
      _id: folder._id,
      folderName: folder.folderName,
      folderOwner: folder.folderOwner,
      folderParentDirectory: folder.folderParentDirectory,
    });
  } else {
    res.status(400).json({
      message: "An unknown error occurred",
    });
    return;
  }
});

const getFolderController = expressAsyncHandler(async (req, res) => {
  let { folderParentDirectory } = req.body;

  if (!folderParentDirectory) {
    folderParentDirectory = null;
  }

  let folderList = await Folder.find({
    $and: [
      { folderParentDirectory: folderParentDirectory },
      { folderOwner: req.user._id },
    ],
  })
    .populate("folderOwner", "-userPassword")
    .populate("folderParentDirectory");

  if (folderList) {
    res.status(201).json({
      folderList: folderList,
    });
  } else {
    res.status(400).json({
      message: "Folder not found",
    });
    return;
  }
});

// *********************** File Controllers ************************/

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
    res.status(400).json({
      message: "FolderId cannot be blank",
    });
    return;
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
  createFolderController,
  getFolderController,
  createFileController,
  getFilesInFolderController,
};
