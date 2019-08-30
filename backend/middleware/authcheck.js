const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

exports.fileauthcheck = (req, res, next) => {
    jwt.verify(req.body.token, "ysn852jd48", async (err, data) => {
        if (err) {
            if (req.files) {
                const deldata = () => {
                    for (let i = 0; i < req.files.length; i++) {
                        fs.unlink(path.join(__dirname, `../uploads/${req.dest}/${req.files[i].filename}`), () => {
                        })
                    }
                };
                await deldata();

                res.status(500).json({
                    message: err.message,
                });
                return;
            } else if (req.file) {
                fs.unlink(path.join(__dirname, `../uploads/${req.dest}/${req.file.filename}`), () => {
                    res.status(500).json({
                        message: err.message,
                    })
                });
                return;
            } else {
                res.status(500).json({
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
    jwt.verify(req.body.token, "ysn852jd48", (err, data) => {
        if(err){
            res.status(500).json({
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
        jwt.verify(req.body.token, "ysn852jd48", (err, data) => {
            if(err){
                res.status(500).json({
                    message: err.message,
                });
                return;
            }
            res.userdata = data;
        })
    }else{
        res.userdata = null;
    }
    next()
};
