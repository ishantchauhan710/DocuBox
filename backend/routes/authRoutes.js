const express = require('express');
const { signupUserController, loginUserController } = require('../controllers/authControllers');
const router = express.Router();

router.post('/signup',signupUserController);
router.post('/login',loginUserController)

module.exports = router;