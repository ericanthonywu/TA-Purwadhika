const express = require('express');
const router = express.Router();

const authController = require('../controller/adminAuth');
const tableController = require('../controller/table');

router.post('/login',authController.login);
router.get('/migrate',authController.migrate);
router.post('/checkToken',authController.checkToken);

router.post('/users',tableController.user)

module.exports = router;
