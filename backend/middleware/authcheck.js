const jwt = require('jsonwebtoken')

exports.authcheck = (req,res,next) => {
    // jwt.verify(req.body.token,"ysn852jd48",(err,data) => {
    //     if(err){
    //         res.status(500).json({
    //             message:"token expire",
    //             err:err
    //         })
    //         return
    //     }
    //     res.userdata = data;
    // })
    next()
}