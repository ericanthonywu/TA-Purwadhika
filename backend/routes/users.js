const express = require('express');
const router = express.Router();

const authController = require('../controller/auth');

/* GET users listing. */
router.get('/verify/:token', authController.verify);

module.exports = router;
