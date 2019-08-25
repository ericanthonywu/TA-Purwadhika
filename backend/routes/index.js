const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const postStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        req.dest = "post"
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

const authController = require('../controller/auth');
const showController = require('../controller/show');

const authMiddleware = require('../middleware/authcheck');

//auth route
router.post('/login', authController.login);
router.get('/verify/:token', authController.verify);
router.post('/register', authController.register);
router.post('/checkemail', authController.checkemail);
router.post('/checkusername', authController.checkusername);

//profile route
router.post('/getprofile', authMiddleware.authcheck, showController.profile);
router.post('/addpost',uploadPost.array('image', 10), authMiddleware.authcheck, showController.addPost);

module.exports = router;
