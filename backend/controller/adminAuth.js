const model = require("../model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const {admin: Admin} = model;
const e = err => {
    if (err) console.error(err)
};

exports.login = (req, res) => {
    Admin.findOne({
        username: req.body.username
    }).select('+password').exec((err, data) => {
        e(err);
        if (data) {
            bcrypt.compare(req.body.password, data.password, (err, c) => {
                e(err);
                if (c) {
                    jwt.sign({
                        id: data._id,
                        role: data.role,
                        username: data.username
                    }, "ysn852jd48", {expiresIn: "24h"}, (err, token) => {
                        e(err);
                        res.status(200).json({
                            id: data._id,
                            role: data.role,
                            username: data.username,
                            token: token
                        })
                    })
                }
            })
        } else {
            res.status(401).json({})
        }
    })
};
exports.migrate = (req, res) => {
    new Admin({
        username: "superadmin",
        password: bcrypt.hashSync('admin', 10),
        role: 3
    }).save(err => {
        e(err);
        res.status(201).json({})
    })
};
exports.checkToken = (req, res) => {
    jwt.verify(req.body.token, "ysn852jd48", err => {
        res.status(err ? 401 : 200).json({})
    })
};
