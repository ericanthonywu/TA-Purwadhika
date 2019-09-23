//add-on
const model = require('../model');

//model
const {user: User, post: Post, chat: Chat} = model;

exports.profile = (req, res) => {
    User.findOne({username: req.body.username, email_st: 1}).populate('follower').populate('following')
        .then(data => {
            if (data) {
                Post.find({user: data._id,ban: false}, [], {
                    sort: {
                        createdAt: -1 //Sort by Date Added DESC
                    }
                })
                    .populate("user","username profilepicture")
                    .populate("comments.user","username profilepicture")
                    .populate("comments.like","username profilepicture")
                    .populate('like',"username profilepicture")
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
            } else {
                res.status(500).json({
                    err: "No User founded"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                err: err
            })
        })

};
exports.showProfile = (req, res) => {
    User.findById(res.userdata.id).select("email nickname bio").then(data => res.status(200).json({data: data}))
};

exports.searchUser = (req, res) => {
    // User.find({
    //     username:  { $regex: req.body.param + '.*' },
    //     email_st: 1
    // }, (err, data) => {
    //     if (err) console.error(err);
    //     res.status(200).json({
    //         data: data
    //     })
    // })

    User.search({
        bool: {
            must: { //required
                prefix: {
                    username: req.body.param, //search prefix
                },
            },
            filter: {
                bool: {
                    must: { //required
                        match: { //match data
                            email_st: 1
                        }
                    }
                }
            }
        }
    }, {
        // _source:["username"],
        from: 0, //pagination
        size: 10, //limit
    }, (err, data) => {
        if (err) {
            res.status(err.statusCode).json({
                msg: err.msg,
                response: JSON.parse(err.response) || JSON.parse(err)
            })
        } else {
            res.status(200).json({
                data: data.hits.hits
            })
        }
    })
};

exports.updateProfile = (req, res) => {
    const updatedData = {
        email: req.body.email,
        nickname: req.body.nickname,
        bio: req.body.bio
    };
    if (req.file) {
        updatedData.profilepicture = req.file.filename
    }
    User.findByIdAndUpdate(res.userdata.id, updatedData, {
        'new': true
    }, err => {
        if (err) {
            res.status(500).json({
                err: err
            })
        } else {
            res.status(200).json({
                data: req.file ? req.file.filename : null
            })
        }
    })
};

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
        caption.split(" ").forEach(o => {
            if (o.charAt(0) === "@") {
                User.findOne({
                    username: o.replace("@", ""),
                    email_st: 1
                }, (err, userTagged) => {
                    if (userTagged && (res.userdata.id != userTagged._id)) {
                        User.findByIdAndUpdate(userTagged._id, {
                            $push: {
                                notification: {
                                    $each: [{
                                        message: `mentioned you in post`,
                                        post: data._id,
                                        user: res.userdata.id,
                                    }],
                                    "$position": 0
                                }
                            }
                        }, {'new': true}).exec(err => {
                            if (err) console.error(err);
                            const {io} = req;
                            io.sockets.emit('newNotifications', {
                                message: `mentioned you in post`,
                                post: data,
                                user: res.userdata,
                                time: Date.now(),
                                to: userTagged,
                                type: 'tag comment post'
                            });
                        });
                    }
                })
            }
        });
        return res.status(200).json({
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
            user: [...data.following, res.userdata.id],
            ban: false
        } : {ban: false}, [], {
            skip: offset, // Starting Row
            limit: 10, // Ending Row
            sort: {
                createdAt: -1 //Sort by Date Added DESC
            }
        }).populate("user","username profilepicture").populate("comments.user","username profilepicture").populate("comments.like","username profilepicture").populate('like',"username profilepicture").exec((err, post) => {
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
            }, {}, (err, data) => {
                if (data.user != res.userdata.id) {
                    User.findByIdAndUpdate(data.user, {
                        $push: {
                            notification: {
                                $each: [{
                                    message: `like your posts`,
                                    post: req.body.id,
                                    user: res.userdata.id
                                }],
                                "$position": 0
                            },
                        }
                    }, {
                        new: true
                    }, err => {
                        const {io} = req;
                        User.findById(data.user).select("username").then(user => {
                            io.sockets.emit('newNotifications', {
                                message: `like your posts`,
                                post: data,
                                user: res.userdata,
                                to: user,
                                type: 'post',
                                time: Date.now()
                            });
                        })
                    });
                }
                res.status(err ? 500 : 202).json(err ? {
                    err: err
                } : {})
            });
            break;
        case "remove":
            Post.findByIdAndUpdate(req.body.id, {
                $pull: {
                    like: res.userdata.id
                }
            }, {}, err => {
                res.status(err ? 500 : 200).json(err ? {err: err} : {
                    message: "success",
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
    }, {}, err => {
        if (err) {
            return res.status(500).json({
                err: err
            })
        } else {
            Post.findById(req.body.id).select("user comments image").then(data => {
                if (data.user != res.userdata.id) {
                    User.findByIdAndUpdate(data.user, {
                        $push: {
                            notification: {
                                $each: [{
                                    message: `comment on your posts`,
                                    post: req.body.id,
                                    user: res.userdata.id,
                                }],
                                "$position": 0
                            }
                        }
                    }, {'new': true}).then(() => {
                        const {io} = req;
                        User.findById(data.user).select("username").then(user => {
                            io.sockets.emit('newNotifications', {
                                message: `comment on your posts`,
                                post: data,
                                user: res.userdata,
                                time: Date.now(),
                                to: user,
                                type: 'comment post'
                            });
                        })
                    });
                }
                req.body.value.split(" ").forEach(o => {
                    if (o.charAt(0) === "@") {
                        User.findOne({
                            username: o.replace("@", ""),
                            email_st: 1
                        }).select("username").then(userTagged => {
                            if (userTagged && (res.userdata.id != userTagged._id)) {
                                User.findByIdAndUpdate(userTagged._id, {
                                    $push: {
                                        notification: {
                                            $each: [{
                                                message: `mentioned you in comments`,
                                                post: req.body.id,
                                                user: res.userdata.id,
                                            }],
                                            "$position": 0
                                        }
                                    }
                                }, {'new': true}).then(() => {
                                    const {io} = req;
                                    io.sockets.emit('newNotifications', {
                                        message: `mentioned you in comments`,
                                        post: data,
                                        user: res.userdata,
                                        time: Date.now(),
                                        to: userTagged,
                                        type: 'tag comment post'
                                    });
                                });
                            }
                        })
                    }
                });
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
                'comments._id': req.body.id
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
                    Post.findById(req.body.postid).populate("comments.user","username profilepicture").then(data => {
                        const userCommentData = data.comments.filter(o => {
                            return o._id == req.body.id
                        })[0].user;
                        if (res.userdata.id != userCommentData._id) {
                            User.findByIdAndUpdate(userCommentData._id, {
                                $push: {
                                    notification: {
                                        $each: [{
                                            message: `like your comment `,
                                            post: req.body.postid,
                                            user: res.userdata.id,
                                        }],
                                        "$position": 0
                                    },

                                }
                            }, {'new': true}).then(() => {
                                const {io} = req;
                                io.sockets.emit('newNotifications', {
                                    message: `like your comment `,
                                    post: data,
                                    user: res.userdata,
                                    to: userCommentData,
                                    type: 'comment like',
                                    time: Date.now()
                                });
                            });
                        }
                        res.status(err ? 500 : 202).json(err ? {
                            err: err
                        } : {})
                    })
                }
            });
            break;
        case "remove":
            Post.findOneAndUpdate({
                _id: req.body.postid,
                'comments._id': req.body.id
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
    Post.findById(req.body.id).populate("user","username profilepicture").populate("comments.user","username profilepicture").populate("comments.like","username profilepicture").populate('like','username profilepicture').then(data => {
        if(!data.ban) {
            res.status(200).json({
                post: data
            })
        }else{
            res.status(404).json({})
        }
    }).catch(err => {
        res.status(500).json({
            err: err
        })
    })
};
exports.follow = (req, res) => {
    const {io} = req;
    User.findByIdAndUpdate(req.body.userTarget, {
        $push: {
            follower: res.userdata.id
        }
    }, {
        "new": true
    }, err => {
        if (err) {
            res.status(500).json({
                err: err
            })
        }
        User.findByIdAndUpdate(res.userdata.id, {
            $push: {
                following: req.body.userTarget
            }
        }, {
            "new": true
        }, err => {
            if (req.body.userTarget !== res.userdata.id) {
                User.findByIdAndUpdate(req.body.userTarget, {
                    $push: {
                        notification: {
                            $each: [{
                                message: `started following you`,
                                user: res.userdata.id
                            }],
                            "$position": 0
                        },
                    }
                }, {'new': true}, err => {
                    User.findById(req.body.userTarget).select("username").then(data => {
                        io.sockets.emit('newNotifications', {
                            message: `started following you`,
                            user: res.userdata,
                            time: Date.now(),
                            type: 'follow',
                            to: data
                        })
                    });
                })
            }
            res.status(err ? 500 : 202).json(err ? {
                err: err
            } : {})
        })
    })
};
exports.unfollow = (req, res) => {
    User.findByIdAndUpdate(req.body.userTarget, {
        $pull: {
            follower: res.userdata.id
        }
    }, {
        "new": true
    }, err => {
        if (err) {
            return res.status(500).json({
                err: err
            })
        }
        User.findByIdAndUpdate(res.userdata.id, {
            $pull: {
                following: req.body.userTarget
            }
        }, {
            "new": true
        }, err => {
            res.status(err ? 500 : 200).json(err ? {
                err: err
            } : {})
        })
    })
};
exports.getNotification = (req, res) => {
    User.findById(res.userdata.id).select('notification').populate('notification.post', 'image').populate('notification.user', "username profilepicture")
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    err: err
                })
            } else {
                User.countDocuments({
                    _id: res.userdata.id,
                    "notification.read": false
                }, (err, count) => {
                    res.status(200).json({
                        data: data.notification,
                        unRead: count
                    })
                })
            }
        })
};
exports.readNotif = (req, res) => {
    User.findOneAndUpdate({_id: res.userdata.id, "notification.read": false}, {
        $set: {
            "notification.$[].read": true //https://jira.mongodb.org/browse/SERVER-1243
        }
    }, {new: true}, err => {
        res.status(err ? 500 : 200).json(err ? {err: err} : {})
    })
};
exports.showChat = (req, res) => {
    User.findOne({username: req.body.username}).then(data => {
        if (data) {
            Chat.findOne({
                $and: [{
                    participans: data._id,
                }, {
                    participans: res.userdata.id,
                }]
            }).populate("message.sender","username").populate("participans","username").exec((err, chat) => {
                res.status(err ? 500 : 200).json(err ? {err: err} : {
                    data: chat
                })
            })
        } else {
            res.status(404).json({err: "user not found"})
        }
    });
};
exports.sendChat = (req, res) => {
    const {io} = req;
    User.findOne({username: req.body.username}).select("username").then(data => {
        if (data) {
            Chat.countDocuments({
                $and: [{
                    participans: data._id,
                }, {
                    participans: res.userdata.id,
                }]
            }).then(chatcheck => {
                if (chatcheck) {
                    Chat.findOneAndUpdate({
                        $and: [{
                            participans: data._id,
                        }, {
                            participans: res.userdata.id,
                        }]
                    }, {
                        $push: {
                            message: {
                                sender: res.userdata.id,
                                message: req.body.msg
                            }
                        }
                    }, err => {
                        res.status(err ? 500 : 200).json(err ? {err: err} : {});
                        if (!err) {
                            io.sockets.emit('newChat', {
                                to: data,
                                from: res.userdata,
                                chat: {
                                    message: req.body.msg,
                                    time: Date.now(),
                                    sender: res.userdata,
                                    read: false
                                }
                            })
                        }
                    })
                } else {
                    new Chat({
                        participans: [data._id, res.userdata.id],
                        message: {
                            sender: res.userdata.id,
                            message: req.body.msg
                        }
                    }).save(err => {
                        io.sockets.emit('newChat', {
                            to: data,
                            from: res.userdata,
                            chat: {
                                message: req.body.msg,
                                sender: res.userdata,
                                read: false
                            }
                        });
                        res.status(err ? 500 : 200).json(err ? {err: err} : {});
                    })
                }
            });
        } else {
            res.status(404).json({err: "user not found"})
        }
    });
};
exports.getChat = (req, res) => {
    Chat.find({
        participans: res.userdata.id
    }).populate("participans","username").exec((err, data) => {
        res.status(err ? 500 : 200).json(err ? {err: err} : {
            data: data
        })
    })
};
exports.updateChat = (req, res) => {
    const {io} = req;
    console.log(req.body);
    User.findOne({username: req.body.username}).select("username").then(data => {
        Chat.findOneAndUpdate({
            $and: [{
                participans: data._id,
            }, {
                participans: res.userdata.id,
            }, {
                "message.sender": res.userdata.id // eric jwancok by:tmangowal, the king of prank
            }]
        }, {
            $set: {
                "message.$[].read": true //https://jira.mongodb.org/browse/SERVER-1243
            }
        }, err => {
            io.sockets.emit('readChat', {
                to: data,
                from: res.userdata,
            });
            res.status(err ? 500 : 200).json(err ? {err: err} : {})
        })
    });
};
