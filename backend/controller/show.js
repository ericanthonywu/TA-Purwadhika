//add-on
const model = require('../model');

//model
const User = model.user;
const Post = model.post;

exports.profile = (req, res) => {
    User.findOne({_id: res.userdata.id}, (err, data) => {
        if (err) console.error(err);
        return res.status(200).json({
            data: data
        })
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
            return;
        }
        return res.status(200).json({
            message: "Data Berhasil Masuk",
            id: data._id
        })
    });
};

exports.dashboard = (req, res) => {
    const {offset} = req.body;
    if (res.userdata) {
        User.findOne({_id: res.userdata.id}, (err, data) => {
            if (err) {
                return res.status(500).json({err: err});
            }

            Post.find({
                user: [...data.following, res.userdata.id]
            }, [], {
                skip: offset, // Starting Row
                limit: 10, // Ending Row
                sort: {
                    createdAt: -1 //Sort by Date Added DESC
                }
            }).populate("user").exec((err, post) => {
                console.log(post)
                if(err){
                    return res.status(500).json({
                        err:err
                    })
                }else {
                    return res.status(200).json({
                        post: post
                    });
                }
            })
        })
    }else {
        Post.find({}, [], {
            skip: offset, // Starting Row
            limit: 10, // Ending Row
            sort: {
                createdAt: -1 //Sort by Date Added DESC
            }
        }).populate("user").exec((err, post) => {
            if(err){
                return res.status(500).json({
                    err:err
                })
            }else {
                return res.status(200).json({
                    post: post
                });
            }
        })
    }
};

