const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createFolderController,
  getFolderController,
} = require("../controllers/folderControllers");

const {
  createFileController,
  getFilesInFolderController,
  searchFilesUsingNameController,
} = require("../controllers/fileControllers");

const { multerStorage } = require("../config/multerConfig");
const router = express.Router();

router.route("/create-folder").post(authMiddleware, createFolderController);
router
  .route("/get-folders-in-folder")
  .post(authMiddleware, getFolderController);

router
  .route("/create-file")
  .post(
    authMiddleware,
    multerStorage.array("upload", 25),
    createFileController
  );

  router
  .route("/get-files-in-folder")
  .post(authMiddleware, getFilesInFolderController);

  router
  .route("/search-file-name")
  .post(authMiddleware, searchFilesUsingNameController);

  

module.exports = router;
