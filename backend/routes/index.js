const express = require('express');
const router = express.Router();

const authController = require('../controller/auth');

/* GET home page. */
router.get('/login', authController.getlogin);
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/checkemail', authController.checkemail);
router.post('/checkusername', authController.checkusername);


module.exports = router;
