const {user: User,post: Post} = require('../model');
exports.user = (req,res) => {
    User.find().select('profilepicture email username status').then(data => {
        res.status(200).json({
            data: data
        })
    })
}
exports.post = (req,res) => {
    Post.find().select("image caption user ban").populate("user","username").then(data =>
        res.status(200).json({
            data: data
        })
    )
}
