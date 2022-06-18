const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createFolderController,
  getFolderController,
  deleteFolderController,
  renameFolderController,
} = require("../controllers/folderControllers");

const {
  createFileController,
  getFilesInFolderController,
  searchFilesUsingNameController,
  searchFilesUsingTypeController,
  getTotalStorageConsumptionController,
} = require("../controllers/fileControllers");

const {
  shareFileController,
  revokeFileAccessController,
  getFilesSharedToMeController,
  getFilesSharedByMeController,
} = require("../controllers/shareFileControllers");

const {
  shareFolderController,
  revokeFolderAccessController,
  getFoldersSharedToMeController,
  getFoldersSharedByMeController,
} = require("../controllers/shareFolderControllers");

const { multerStorage } = require("../config/multerConfig");

const router = express.Router();

// **************** FOLDER ROUTES ****************

router.route("/create-folder").post(authMiddleware, createFolderController);

router
  .route("/get-folders-in-folder")
  .post(authMiddleware, getFolderController);

router.route("/delete-folder").post(authMiddleware, deleteFolderController);

router.route("/rename-folder").post(authMiddleware, renameFolderController);

router.route("/share-folder").post(authMiddleware, shareFolderController);

router
  .route("/revoke-folder")
  .post(authMiddleware, revokeFolderAccessController);

router
  .route("/get-folders-shared-to-me")
  .post(authMiddleware, getFoldersSharedToMeController);

router
  .route("/get-folders-shared-by-me")
  .post(authMiddleware, getFoldersSharedByMeController);

// **************** FILE ROUTES ****************

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

router.route("/share-file").post(authMiddleware, shareFileController);

router.route("/revoke-file").post(authMiddleware, revokeFileAccessController);

router
  .route("/get-files-shared-to-me")
  .post(authMiddleware, getFilesSharedToMeController);

router
  .route("/get-files-shared-by-me")
  .post(authMiddleware, getFilesSharedByMeController);

// **************** OTHER DOCUMENT RELATED ROUTES ****************

router
  .route("/storage-consumption")
  .post(authMiddleware, getTotalStorageConsumptionController);

module.exports = router;
