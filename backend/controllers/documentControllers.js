const expressAsyncHandler = require("express-async-handler");
const Folder = require("../models/folderModel.js");

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
  const user = req.user._id;

  if (!folderParentDirectory) {
    folderParentDirectory = null;
  }

  console.log("UserId: ", user._id);

  let folder = await Folder.find({
    $and: [
      { folderParentDirectory: folderParentDirectory },
      { folderOwner: req.user._id },
    ],
  })
    .populate("folderOwner", "-userPassword")
    .populate("folderParentDirectory");

  if (folder) {
    res.status(201).json({
      folder: folder,
    });
  } else {
    res.status(400);
    throw new Error("Folder not found");
  }
});

module.exports = { createFolderController, getFolderController };
