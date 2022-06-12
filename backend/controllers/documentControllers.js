const expressAsyncHandler = require("express-async-handler");
const Folder = require("../models/folderModel.js");

const createFolderController = expressAsyncHandler(async (req, res) => {
  let { folderName, folderOwner, folderParentDirectory } = req.body;

  if (!folderName) {
    res.status(400).json({
      message: "Folder name cannot be blank",
    });
    return;
  }

  if (!folderOwner) {
    res.status(400).json({
      message: "Folder owner cannot be blank",
    });
    return;
  }

  if (!folderParentDirectory) {
    folderParentDirectory = null;
  }

  const folder = await Folder.create({
    folderName,
    folderOwner,
    folderParentDirectory,
  });

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

module.exports = { createFolderController };
