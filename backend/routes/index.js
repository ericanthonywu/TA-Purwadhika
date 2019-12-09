const express = require('express');
const router = express.Router();

const authController = require('../controller/auth');
const showController = require('../controller/show');

const authMiddleware = require('../middleware/authcheck');
const fileMiddleware = require('../middleware/filemiddleware')

//auth route
router.post('/login', authController.login);
router.get('/verify/:token', authController.verify);
router.post('/register', authController.register);
router.post('/checkemail', authController.checkemail);
router.post('/checkusername', authController.checkusername);

router.post('/searchUser', showController.searchUser);

//dashboard route
router.post('/dashboard', authMiddleware.dashboardcheck, showController.dashboard);

//explore route
router.post("/explore",authMiddleware.dashboardcheck, showController.explore);

//profile route
router.post('/getprofile', authMiddleware.authcheck, showController.profile);
router.post('/showProfile', authMiddleware.authcheck, showController.showProfile);
router.post('/follow', authMiddleware.authcheck, showController.follow);
router.post('/unfollow', authMiddleware.authcheck, showController.unfollow);
router.post('/updateProfile', fileMiddleware.uploadUser.single('file'), authMiddleware.fileauthcheck, showController.updateProfile);
router.post('/notification', authMiddleware.authcheck, showController.getNotification);
router.post('/readNotif', authMiddleware.authcheck, showController.readNotif);
router.post('/reportUser', authMiddleware.authcheck, showController.reportUser);

//post route
router.post('/addpost', fileMiddleware.uploadPost.array('image', 10), authMiddleware.fileauthcheck, showController.addPost);
router.post('/tooglelike', authMiddleware.authcheck, showController.togglelike);
router.post('/comments', authMiddleware.authcheck, showController.comments);
router.post('/toogleCommentLike', authMiddleware.authcheck, showController.toogleCommentLike);
router.post('/showPost', showController.showPost);
router.post('/reportPost', authMiddleware.authcheck, showController.reportPost);

//chat route
router.post('/sendChat', authMiddleware.authcheck, showController.sendChat);
router.post('/showChat', authMiddleware.authcheck, showController.showChat);
router.post('/getChat', authMiddleware.authcheck, showController.getChat);
router.post('/updateChat', authMiddleware.authcheck, showController.updateChat);

router.post('/lastCommentsuser',showController.lastComments)

module.exports = router;
