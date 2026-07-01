const express = require('express');
const { signup, login, changePassword } = require('../controllers/authController');
const { validateSignup, validateLogin, validateChangePassword } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/change-password', auth, validateChangePassword, changePassword);

module.exports = router;
