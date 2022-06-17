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

router
  .route("/revoke-folder")
  .post(authMiddleware, revokeFolderAccessController);


  router.route("/get-files-shared-to-me").post(authMiddleware, getFilesSharedToMeController);

  router.route("/get-files-shared-by-me").post(authMiddleware, getFilesSharedByMeController);

  router.route("/get-folders-shared-to-me").post(authMiddleware, getFoldersSharedToMeController);

  router.route("/get-folders-shared-by-me").post(authMiddleware, getFoldersSharedByMeController);

  



module.exports = router;
