const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const postStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        req.dest = "post";
        cb(null, path.join(__dirname, `../uploads/${req.dest}`))
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }
});
const uploadPost = multer({
    storage: postStorage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
});
const userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        req.dest = "profile_picture";
        cb(null, path.join(__dirname, `../uploads/${req.dest}`))
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }
});

const uploadUser = multer({
    storage: userStorage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
});

const authController = require('../controller/auth');
const showController = require('../controller/show');

const authMiddleware = require('../middleware/authcheck');

//auth route
router.post('/login', authController.login);
router.get('/verify/:token', authController.verify);
router.post('/register', authController.register);
router.post('/checkemail', authController.checkemail);
router.post('/checkusername', authController.checkusername);
router.post('/checktoken', authController.checktoken);

router.post('/searchUser', showController.searchUser);

//dashboard route
router.post('/dashboard',authMiddleware.dashboardcheck,showController.dashboard);

//profile route
router.post('/getprofile', authMiddleware.authcheck, showController.profile);
router.post('/showProfile', authMiddleware.authcheck, showController.showProfile);
router.post('/follow', authMiddleware.authcheck, showController.follow);
router.post('/unfollow', authMiddleware.authcheck, showController.unfollow);
router.post('/updateProfile',uploadUser.single('file'), authMiddleware.fileauthcheck, showController.updateProfile);
router.post('/notification',authMiddleware.authcheck,showController.getNotification);
router.post('/readNotif',authMiddleware.authcheck,showController.readNotif);

//post route
router.post('/addpost',uploadPost.array('image', 10), authMiddleware.fileauthcheck, showController.addPost);
router.post('/tooglelike',authMiddleware.authcheck,showController.togglelike);
router.post('/comments',authMiddleware.authcheck,showController.comments);
router.post('/toogleCommentLike',authMiddleware.authcheck,showController.toogleCommentLike);
router.post('/showPost',showController.showPost);


module.exports = router;
