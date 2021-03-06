const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

exports.fileauthcheck = (req, res, next) => {
    jwt.verify(req.body.token, process.env.JWTSECRETKEY, async (err, data) => {
        if (err) {
            if (req.files) {
                const deldata = () => {
                    for (let i = 0; i < req.files.length; i++) {
                        fs.unlinkSync(path.join(__dirname, `../uploads/${req.dest}/${req.files[i].filename}`))
                    }
                };
                await deldata();

                res.status(419).json({
                    message: err.message,
                });
                return;
            } else if (req.file) {
                fs.unlink(path.join(__dirname, `../uploads/${req.dest}/${req.file.filename}`), () =>
                    res.status(419).json({message: err.message,}));
                return;
            } else {
                res.status(419).json({
                    message: err.message,
                });
                return;
            }
        }
        res.userdata = data;
        next()
    })
};

exports.authcheck = (req, res, next) => {
    jwt.verify(req.body.token, process.env.JWTSECRETKEY, (err, data) => {
        if(err){
            res.status(419).json({
                message: err.message,
            });
            return;
        }
        res.userdata = data;
        next()
    })
};

exports.dashboardcheck = (req, res, next) => {
    if(req.body.token) {
        jwt.verify(req.body.token, process.env.JWTSECRETKEY, (err, data) => {
            if(err){
                return res.status(419).json({
                    message: err.message,
                });
            }else {
                res.userdata = data;
                next()
            }
        })
    }else{
        res.userdata = null;
        next()
    }
};
