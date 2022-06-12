const express = require('express');
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createFolderController, getFolderController, createFileController, getFilesInFolderController } = require('../controllers/documentControllers');
const router = express.Router();

router.route("/createfolder").post(authMiddleware,createFolderController);
router.route("/getfoldersinfolder").post(authMiddleware,getFolderController)

router.route("/createfile").post(authMiddleware,createFileController);
router.route("/getfilesinfolder").post(authMiddleware,getFilesInFolderController);



module.exports = router;