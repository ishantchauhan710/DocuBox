const express = require('express');
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createFolderController, getFolderController } = require('../controllers/documentControllers');
const router = express.Router();

router.route("/createfolder").post(authMiddleware,createFolderController);
router.route("/getfoldersindirectory").post(authMiddleware,getFolderController)

module.exports = router;