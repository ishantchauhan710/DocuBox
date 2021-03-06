const expressAsyncHandler = require("express-async-handler");
const File = require("../models/fileModel.js");
const Folder = require("../models/folderModel.js");
const User = require("../models/userModel.js");
const { deleteFileFromStorage } = require("../util/fileUtil.js");

const createFolderController = expressAsyncHandler(async (req, res) => {
  let { folderName, folderParentDirectory } = req.body;

  if (!folderName) {
    res.status(400).json({
      message: "Folder name cannot be blank",
    });
    return;
  }

  if (!folderParentDirectory) {
    folderParentDirectory = [];
  }

  const folderOwner = req.user._id;

  const folderSharedTo = [];

  let folder = await Folder.create({
    folderName,
    folderOwner,
    folderSharedTo,
    folderParentDirectory,
  });

  folder = await folder.populate("folderOwner", "-userPassword");
  //folder = await folder.populate("folderParentDirectory");

  if (folder) {
    res.status(201).json({
      folder: folder,
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

const deleteFolderController = expressAsyncHandler(async (req, res) => {
  let { folderId } = req.body;

  const folder = await Folder.findById(folderId);

  if (!folder) {
    return res.status(400).json({ message: "Folder not found" });
  }

  const foldersToDelete = await Folder.find({
    $or: [{ _id: folderId }, { folderParentDirectory: { $in: [folderId] } }],
  });

  const filesToDelete = await File.find({ fileDirectory: { $in: [folderId] } });

  let storageToClear = 0;
  const folderOwner = folder.folderOwner

  let filesToDeleteFromStorage = [];
  filesToDelete.forEach((fileItem) => {
    filesToDeleteFromStorage.push(fileItem.fileName);
    storageToClear += parseInt(fileItem.fileSize);
  });

  try {
    filesToDelete.forEach(async (docuboxFile) => {
      await File.findByIdAndDelete(docuboxFile._id);
    });

    foldersToDelete.forEach(async (docuboxFolder) => {
      await Folder.findByIdAndDelete(docuboxFolder._id);
    });

    filesToDeleteFromStorage.forEach(async (docuboxFileOnStorage) => {
      await deleteFileFromStorage(docuboxFileOnStorage.fileName);
    });

    const fileOwner = await User.findById(folderOwner);
    const fileOwnerStorageConsumption = fileOwner.userStorageConsumption;
    const updatedFileOwnerStorageConsumption = parseInt(fileOwnerStorageConsumption) - parseInt(storageToClear);

    await User.findByIdAndUpdate(folderOwner, {
      userStorageConsumption: updatedFileOwnerStorageConsumption,
    });

    res.status(201).json({
      message: "Folder deleted successfully!",
    });
  } catch (e) {
    res.status(400).json({
      message: `Error Deleting Folder: ${e.message}`,
    });
  }
});

const renameFolderController = expressAsyncHandler(async (req, res) => {
  let { folderId, newName } = req.body;

  if (!folderId) {
    return res.status(400).json({ message: "FolderId cannot be blank" });
  }

  if (!newName) {
    return res.status(400).json({ message: "Folder name cannot be blank" });
  }

  const folder = await Folder.findById(folderId);
  if (!folder) {
    return res.status(400).json({ message: "Folder not found" });
  }

  try {
    await Folder.findByIdAndUpdate(folderId, { folderName: newName });
    return res.status(201).json({ message: "Success" });
  } catch (e) {
    return res.status(400).json({ message: "An unknown error occurred" });
  }
});

module.exports = {
  createFolderController,
  getFolderController,
  deleteFolderController,
  renameFolderController,
};
