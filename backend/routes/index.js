const express = require('express');
const router = express.Router();
const multer = require('multer');
const postStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, '../uploads/post')
    },
    filename: (req,file,cb) =>{
        cb(null, new Date().toISOString() + file.originalname)
    }
})
const uploadPost = multer({storage : postStorage, limits: {
        fileSize : 1024 * 1024 * 5
}})

const authController = require('../controller/auth');
const showController = require('../controller/show')

const authMiddleware = require('../middleware/authcheck');

//auth route
router.post('/login', authController.login);
router.get('/verify/:token', authController.verify);
router.post('/register', authController.register);
router.post('/checkemail', authController.checkemail);
router.post('/checkusername', authController.checkusername);

//profile route
router.post('/getprofile',authMiddleware.authcheck,showController.profile);
router.post('/addpost',authMiddleware.authcheck,uploadPost.single('image'),showController.addPost);

module.exports = router;
