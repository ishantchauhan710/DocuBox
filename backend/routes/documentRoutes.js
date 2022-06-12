const express = require('express');
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createFolderController } = require('../controllers/documentControllers');
const router = express.Router();

router.route("/createfolder").post(authMiddleware,createFolderController);

module.exports = router;