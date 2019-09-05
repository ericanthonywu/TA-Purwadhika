//add-on
const model = require('../model');

//model
const User = model.user;
const Post = model.post;

exports.profile = (req, res) => {
    User.findOne({_id: res.userdata.id, email_st: 1}).populate('follower').populate('following').exec()
        .then(data => {
            Post.find({user: res.userdata.id}, [], {
                sort: {
                    createdAt: -1 //Sort by Date Added DESC
                }
            })
                .populate("user")
                .populate("comments.user")
                .populate("comments.like")
                .populate('like')
                .exec()
                .then(post => {
                    res.status(200).json({
                        user: data,
                        post: post
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        err: err
                    })
                })
        })
        .catch(err => {
            res.status(500).json({
                err: err
            })
        })

};
exports.showProfile = (req,res) => {
    User.findById(res.userdata.id).exec().then(res => {
        res.status(200)
    })
}

exports.addPost = (req, res) => {
    const {caption} = req.body;
    const imgname = [];
    for (let i = 0; i < req.files.length; i++) {
        imgname.push(req.files[i].filename)
    }
    new Post({caption: caption, user: res.userdata.id, image: imgname}).save((err, data) => {
        if (err) {
            return res.status(500).json({err: err});
        }
        return res.status(200).json({
            message: "Data Berhasil Masuk",
            id: data._id
        })
    });
};

exports.dashboard = (req, res) => {
    const {offset} = req.body;
    User.findOne(res.userdata ? {_id: res.userdata.id} : {}, (err, data) => {
        if (err) {
            return res.status(500).json({err: err});
        }

        Post.find(res.userdata ? {
            user: [...data.following, res.userdata.id]
        } : {}, [], {
            skip: offset, // Starting Row
            limit: 10, // Ending Row
            sort: {
                createdAt: -1 //Sort by Date Added DESC
            }
        }).populate("user").populate("comments.user").populate("comments.like").populate('like').exec((err, post) => {
            if (err) {
                return res.status(500).json({
                    err: err
                })
            } else {
                return res.status(200).json({
                    post: post
                });
            }
        })
    })
};
exports.togglelike = (req, res) => {
    switch (req.body.action) {
        case "add":
            Post.findByIdAndUpdate(req.body.id, {
                $push: {
                    like: res.userdata.id
                }
            }, {}, err => {
                res.status(200).json({
                    message: "success",
                    err: err
                });
            });
            break;
        case "remove":
            Post.findByIdAndUpdate(req.body.id, {
                $pull: {
                    like: res.userdata.id
                }
            }, {}, err => {
                res.status(200).json({
                    message: "success",
                    err: err
                });
            });
            break;
        default:
            res.status(500).json({
                err: "action undefined"
            })
    }
};
exports.comments = (req, res) => {
    Post.findByIdAndUpdate(req.body.id, {
        $push: {
            comments: {
                user: res.userdata.id,
                comments: req.body.value
            }
        }
    }, {}, (err, data) => {
        if (err) {
            return res.status(500).json({
                err: err
            })
        } else {
            Post.findById(req.body.id, {}, {}, (err, data) => {
                return res.status(200).json({
                    id: data.comments[data.comments.length - 1]._id
                })
            })
        }
    })
};
exports.toogleCommentLike = (req, res) => {
    switch (req.body.action) {
        case "add":
            Post.findOneAndUpdate({
                _id: req.body.postid,
                'comments.id': req.body.id
            }, {
                $push: { //$set nimpa, $push push aray, $pull delete array
                    "comments.$.like": res.userdata.id
                }
            }, err => {
                if (err) {
                    res.status(500).json({
                        err: err
                    })
                } else {
                    res.status(200).json({
                        message: "success",
                    });
                }
            });
            break;
        case "remove":
            Post.findOneAndUpdate({
                _id: req.body.postid,
                'comments.id': req.body.id
            }, {
                $pull: {
                    "comments.$.like": res.userdata.id
                }
            }, {}, err => {
                if (err) {
                    res.status(500).json({
                        err: err
                    })
                } else {
                    res.status(200).json({
                        message: "success",
                    });
                }
            });
            break;
        default:
            res.status(500).json({
                err: "action undefined"
            })
    }
};
exports.showPost = (req, res) => {
    Post.findById(req.body.id).populate("user").populate("comments.user").populate("comments.like").populate('like').exec().then(data => {
        res.status(200).json({
            post: data
        })
    }).catch(err => {
        res.status(500).json({
            err: err
        })
    })
};
