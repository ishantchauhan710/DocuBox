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
  searchFilesUsingTypeController,
  getTotalStorageConsumptionController,
} = require("../controllers/fileControllers");

const { multerStorage } = require("../config/multerConfig");
const {
  shareFileController,
  shareFolderController,
  revokeFileAccessController,
} = require("../controllers/shareFileControllers");
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

router
  .route("/search-file-type")
  .post(authMiddleware, searchFilesUsingTypeController);

router
  .route("/storage-consumption")
  .post(authMiddleware, getTotalStorageConsumptionController);

router.route("/share-file").post(authMiddleware, shareFileController);

router.route("/share-folder").post(authMiddleware, shareFolderController);

router.route("/revoke-file").post(authMiddleware, revokeFileAccessController);

module.exports = router;
