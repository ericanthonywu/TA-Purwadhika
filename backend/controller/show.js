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

exports.profile = (req, res, next) => {
    User.findOne({_id: res.userdata.id}, (err, data) => {
        if (err) console.error(err);
        res.status(200).json({
            data: data
        })
    })
};

exports.addPost = (req, res, next) => {
    const {caption, user} = req.body;
    console.log(req)
    res.status(200).send('asd')
    // new Post({caption: caption, user: user}).save((err, data) => {
    //     if (err) {
    //         res.status(500).json({err: err});
    //         return
    //     }
    //     res.status(200).json({
    //         message: "Data Berhasil Masuk",
    //         id: data._id
    //     })
    // });
};

