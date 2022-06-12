const expressAsyncHandler = require("express-async-handler");
const File = require("../models/fileModel.js");
const Folder = require("../models/folderModel.js");
const { uploadFileToServer } = require("../util/fileHandler.js");

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
    res.status(400);
    throw new Error("An unknown error occurred");
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
    res.status(400);
    throw new Error("Folder not found");
  }
});

// *********************** File Controllers ************************/

const createFileController = expressAsyncHandler(async (req, res) => {
  const file = req.body.fileData;
  console.log("File: ", file);

  if (!file) {
    res.status(400);
    throw new Error("File Data cannot be blank");
  }

  try {
    const result = await uploadFileToServer(file);
    console.log("Result: ", result);
    res.status(201).json({ message: "File uploaded successsfully!" });
  } catch (e) {
    res.status(400);
    throw new Error("Error uploading file: ", e.message);
  }

  // let { fileName, fileData, fileDirectory } = req.body;

  // if (!fileName) {
  //   res.status(400).json({
  //     message: "File name cannot be blank",
  //   });
  //   return;
  // }

  // if (!fileData) {
  //   res.status(400).json({
  //     message: "File data cannot be blank",
  //   });
  //   return;
  // }

  // if (!fileDirectory) {
  //   res.status(400).json({
  //     message: "File directory cannot be blank",
  //   });
  //   return;
  // }

  // const fileOwner = req.user._id;

  // let file = await File.create({
  //   fileName,
  //   fileData,
  //   fileOwner,
  //   fileDirectory,
  // });

  // file = await file.populate("fileOwner", "-userPassword");
  // file = await file.populate("fileDirectory");

  // if (file) {
  //   res.status(201).json({
  //     _id: file._id,
  //     fileName: file.fileName,
  //     fileData: file.fileData,
  //     fileOwner: file.fileOwner,
  //     fileDirectory: file.fileDirectory,
  //   });
  // } else {
  //   res.status(400);
  //   throw new Error("An unknown error occurred");
  // }
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
    res.status(400);
    throw new Error("File not found");
  }
});

module.exports = {
  createFolderController,
  getFolderController,
  createFileController,
  getFilesInFolderController,
};
