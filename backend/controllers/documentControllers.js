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
  res.send({
    message: "File uploaded successfully!",
    urls: req.files.map(function (file) {
      return {
        url: file.location,
        name: file.key,
        type: file.mimetype,
        size: file.size,
      };
    }),
  });
});

// let { file, fileDirectory } = req.body;
// console.log("File: ", file);
// let fileUploadSuccessful = false;

// if (!file) {
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

// let fileName = getUniqueFileName(path.basename(file));
// console.log("Unique File Name: ", fileName);

// const fileOwner = req.user._id;
// console.log("File Owner: ", fileOwner);

// try {
//   await uploadFileToServer(fileName, file);
//   console.log("File upload successful");
//   //res.status(201).json({ message: "File uploaded suceessfully" });
//   fileUploadSuccessful = true
// } catch (e) {
//   res.status(400);
//   throw new Error("Error: ", e);
// }

// if (fileUploadSuccessful) {
//   const storageURL = process.env.STORAGE_URL;
//   const fileData = `${storageURL}/${fileName}`;
//   fileName = getOriginalFileName(fileData)

//   let file = await File.create({
//     fileName,
//     fileData,
//     fileOwner,
//     fileDirectory,
//   });

//   file = await file.populate("fileOwner", "-userPassword");
//   file = await file.populate("fileDirectory");

//   if (file) {
//     res.status(201).json({
//       _id: file._id,
//       fileName: file.fileName,
//       fileData: file.fileData,
//       fileOwner: file.fileOwner,
//       fileDirectory: file.fileDirectory,
//     });
//   } else {
//     res.status(400);
//     throw new Error("An unknown error occurred");
//   }
// } else {
//   console.log("Mongo File Upload Failed")
// }
//});

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
