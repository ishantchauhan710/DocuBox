const express = require('express');
const { signupUserController } = require('../controllers/authControllers');
const router = express.Router();

router.post('/signup',signupUserController);

module.exports = router;