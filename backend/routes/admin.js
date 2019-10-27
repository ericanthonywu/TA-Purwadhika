const express = require('express');
const router = express.Router();

const authController = require('../controller/adminAuth');
const tableController = require('../controller/table');
const actionController = require('../controller/action');

const authMiddleware = require('../middleware/authcheck');

router.post('/login', authController.login);
router.get('/migrate', authController.migrate);
router.post('/checkToken', authController.checkToken);

router.post('/users', authMiddleware.authcheck, tableController.user);
router.post('/blockUsers', authMiddleware.authcheck, actionController.blockUsers);
router.post('/suspendUser', authMiddleware.authcheck, actionController.suspendUsers);

router.post('/posts', authMiddleware.authcheck, tableController.post);
router.post('/hidePost', authMiddleware.authcheck, actionController.hidePost);

router.post('/report', authMiddleware.authcheck, tableController.report);

module.exports = router;
