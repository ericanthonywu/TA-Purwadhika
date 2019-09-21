const {user: User} = require('../model');
exports.user = (req,res) => {
    User.find().select('profilepicture email username').then(data => {
        res.status(200).json({
            data: data
        })
    })
}
