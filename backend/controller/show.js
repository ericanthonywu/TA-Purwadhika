//add-on
const model = require('../model');

//model
const User = model.user;
const Post = model.post;

function handleError(err, res) {
    res.send(500).json({
        error: "Something Went Wrong",
        err: err
    });
}

exports.profile = (req, res) => {
    User.findOne({_id: res.userdata.id}, (err, data) => {
        if (err) console.error(err);
        res.status(200).json({
            data: data
        })
    })
};

exports.addPost = (req, res) => {
    const {caption, user} = req.body;
    const imgname = [];
    for (let i = 0; i < req.files.length; i++) {
        imgname.push(req.files[i].filename)
    }
    new Post({caption: caption, user: user, image: imgname}).save((err, data) => {
        if (err) {
            res.status(500).json({err: err});
            return;
        }
        res.status(200).json({
            message: "Data Berhasil Masuk",
            id: data._id
        })
    });
};

exports.dashboard = (req, res, next) => {
    if(res.userdata){
        User.findOne({_id:res.userdata.id},(err,data) => {
            if (err) {
                res.status(500).json({err: err});
                return;
            }
        })
    }
};

