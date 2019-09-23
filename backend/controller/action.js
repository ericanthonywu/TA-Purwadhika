const {user: User, post: Post} = require('../model');

exports.blockUsers = (req, res) => {
    User.findByIdAndUpdate(req.body.id, {
        status: req.body.status === 1 ? 0 : 1
    }, {
        new: true
    }).then(() => {
        const {io} = req;
        io.sockets.emit('block', {
            to: req.body.id
        });
        res.status(200).json({})
    }).catch(err => res.status(500).json({err: err}))
};
exports.suspendUsers = (req, res) => {
    User.findByIdAndUpdate(req.body.user, {
        status: 2,
        suspendTime: req.body.time
    }, {
        new: true
    }).then(() => {
        const {io} = req;
        io.sockets.emit('suspend', {
            to: req.body.id
        });
        res.status(200).json({})
    }).catch(err => res.status(500).json({err: err}))
};
exports.hidePost = (req, res) => {
    Post.findByIdAndUpdate(req.body.post, {
        ban: req.body.ban
    }).then(() => {
        Post.findById(req.body.post).select("user").populate("user","username").then(post => {
            const {io} = req;
            if(req.body.ban) {
                User.findByIdAndUpdate(post.user,{
                    $push: {
                        $each: [{
                            message: `Post has been removed`,
                            post: req.body.id,
                            report: true
                        }],
                        "$position": 0
                    }
                });
                io.sockets.emit('newNotifications', {
                    message: `post has been removed`,
                    time: Date.now(),
                    to: post.user,
                    user: {
                        username: res.userdata.username
                    },
                    type: 'tag comment post'
                });
            }
        });
        res.status(200).json({})
    }).catch(err => res.status(500).json({err: err}))
};
