const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createFolderController,
  getFolderController,
  createFileController,
  getFilesInFolderController,
} = require("../controllers/documentControllers");
const { multerStorage } = require("../config/multerConfig");
const router = express.Router();

router.route("/create-folder").post(authMiddleware, createFolderController);
router.route("/get-folders-in-folder").post(authMiddleware, getFolderController);

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

module.exports = router;
