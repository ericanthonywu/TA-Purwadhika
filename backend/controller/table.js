const {user: User, post: Post, report: Report} = require('../model');
exports.user = (req, res) => {
    User.find().select('profilepicture email username status').then(data => {
        res.status(200).json({
            data: data
        })
    })
};
exports.post = (req, res) => {
    Post.find().select("image caption user ban").populate("user", "username").then(data =>
        res.status(200).json({
            data: data
        })
    )
};
exports.report = (req, res) => {
    Report.find().populate({
        path: "postId",
        select: {
            image: 1,
            user: 1,
            caption: 1,
            ban: 1
        },
        populate: {
            path: "user",
            select: {
                username: 1,
                profilepicture: 1
            }
        }
    }).populate({
        path: "userId",
        select: {
            profilepicture: 1,
            email: 1,
            username: 1,
            status: 1
        }
    }).populate("reportedBy", "username profilepicture")
        .then(data => res.status(200).json({data: data}))
};
