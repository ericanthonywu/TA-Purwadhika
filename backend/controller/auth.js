const model = require("../model");
const bcrypt = require("bcryptjs");
const user = model.user;
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");

exports.login = (req, res) => {
    const {password, email} = req.body;
    if (password == null || email == null) {
        res.status(401).json({
            message: "Email / Password is Empty"
        });
    } else {
        user.findOne({email: email}).select('+password').exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: err
                });
                return;
            }
            if (data == null) {
                res.status(401).json({
                    message: "Email Not Found"
                });
                return;
            }
            bcrypt.compare(password, data.password, (err, check) => {
                if (err) {
                    res.status(500).json({
                        error: err
                    });
                    return;
                }
                if (check) {
                    if (data.email_st == 1) {
                        jwt.sign(
                            {
                                id: data._id,
                                username: data.username,
                                email: email,
                                profilepicture: data.profilepicture
                            },
                            "ysn852jd48",
                            {expiresIn: "100000h"},
                            (err, token) => {
                                if (err) {
                                    res.status(500).json({error: err});
                                } else {
                                    res.status(200).json({
                                        _token: token,
                                        username: data.username,
                                        _id: data._id,
                                        profile_picture: data.profilepicture
                                    });
                                }

                            }
                        );
                        return;
                    }
                    res.status(401).json({
                        message: "Please Verify Your Email"
                    });
                    return;
                }
                res.status(401).json({
                    message: "Password Incorrect"
                })
            })
        })
    }
};

function makeid(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.register =  (req, res) => {
    const {username, password, email} = req.body;
    if (!username || !password || !email) {
        res.status(401).json({
            error: "Username or Password or Email is empty",
            debug: {
                username: username,
                password: password,
                email: email
            }
        });
    } else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, enc_password) => {
                const token = makeid(50);
                const userDoc = new user({
                    username: username,
                    nickname: username,
                    password: enc_password,
                    email: email,
                    token: token,
                    email_st: 1 //TODO: remove on production
                });
                userDoc.save(
                    err => {
                        if (err) {
                            res.status(500).json({
                                error: err
                            });
                        } else {
                            userDoc.on('es-indexed', err => {
                                if (err) {
                                    res.status(500).json({
                                        error: err
                                    });
                                } else {
                                    const transpoter = nodeMailer.createTransport({
                                        host: "smtp.gmail.com",
                                        port: 465,
                                        secure: true,
                                        service: "Gmail",
                                        requireTLS: true,
                                        auth: {
                                            user: "noreplyerictes@gmail.com",
                                            pass: "ysn852jd48;"
                                        }
                                    });
                                    const mailOption = {
                                        from: "My Chat Email Verification",
                                        to: email,
                                        subject: "Email Verification",
                                        html: `
<!DOCTYPE html PUBLIC>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
    <meta  name='viewport' content='width=display-width, initial-scale=1.0, maximum-scale=1.0,' />
    <title>Account Verification</title>

    <link href='https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i' rel='stylesheet' type='text/css'/>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i' rel='stylesheet' type='text/css'/>


</head>
<body>

<style type='text/css'>
    html {
        width: 100%;
    }
    body
    {margin:0; padding:0; width:100%; -webkit-text-size-adjust:none; -ms-text-size-adjust:none;
    }
    img {
        display: block !important; border:0; -ms-interpolation-mode:bicubic;
    }

    .ReadMsgBody {
        width: 100%;
    }
    .ExternalClass {
        width: 100%;
    }
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
        line-height: 100%;
    }
    .images {
        display:block !important; width:100% !important;
    }

    .heading {
        font-family: Roboto, Arial, Helvetica Neue, Helvetica, sans-serif !important;
    }
    .MsoNormal {
        font-family:'Open Sans', Arial, Helvetica Neue, Helvetica, sans-serif !important;
    }
    p {
        margin:0 !important; padding:0 !important;
    }

    a {
        font-family:'Open Sans', Arial, Helvetica Neue, Helvetica, sans-serif !important;
    }
    .display-button td, .display-button a  {
        font-family: 'Open Sans', Arial, Helvetica Neue, Helvetica, sans-serif !important;
    }
    .display-button a:hover {
        text-decoration:none !important;
    }

    /* MYMAIL STYLES */

    a { color: #6ec8c7; text-decoration: none; }

    .textbutton a { font-family: 'open sans', arial, sans-serif !important; color: #333333 !important; }

    .footer-link a { color: #333333 !important; }


    /* MYMAIL PREHEADER - HIDDEN BY DEFAULT */
    div.preheader{line-height:0px;font-size:0px;height:0px;display:none !important;display:none;visibility:hidden;}


    /* MEDIA QUIRES */

    @media only screen and (max-width:640px) {

        body {
            width:auto !important;
        }
        table[class=display-width] {
            width:100% !important;
        }
        table[class=display-width-1] {
            width:80% !important;
        }
        table[class=responsive] {
            width:280px !important;
        }
        td[class=hide-height] {
            display:none !important;
        }
    }

    @media only screen and (max-width:480px) {

        table[class=display-width] table {
            width:100% !important;
        }
        table[class=display-width] .button-width .display-button {
            width:auto !important;
        }
        table[class=display-width] table[class=responsive] {
            width:280px !important;
        }
        .menu-hide-height {
            display:none !important;
        }
    }

    @media only screen and (max-width:350px) {

        table[class=display-width] table[class=responsive] {
            width:100% !important;
        }
    }

    @media only screen and (max-width:320px) {

        .menu {
            font-size:11px !important;
        }
        .skill-title {
            font-size:13px !important;
        }
    }

</style>

<modules>

    <module label='Header Banner' active auto>

        <!-- HEADER BANNER STARTS -->
        <table align='center' bgcolor='#222222' border='0' cellpadding='0' cellspacing='0' width='100%'>
            <tbody>
            <tr>
                <td align='center'>
                    <!--SECTION TABLE-680-->
                    <table align='center' border='0' cellpadding='0' cellspacing='0' class='display-width' width='680'>
                        <tbody>
                        <tr>
                            <td align='center'>
                                <!--[if gte mso 9]>
                                <v:rect xmlns:v='urn:schemas-microsoft-com:vml' fill='true' stroke='false' style='width:680px; height:450px; margin:auto;'>

                                    <v:textbox inset='0,0,0,0'>
                                <![endif]-->
                                <div style='margin:auto;'>
                                    <table align='center'>
                                        <tbody>
                                        <tr>
                                            <td align='center' style='padding:0 30px;'>
                                                <!--SECTION TABLE-600-->
                                                <table align='center' border='0' cellpadding='0' cellspacing='0' class='display-width' width='600'>
                                                    <tbody>
                                                    <tr>
                                                        <td height='30'></td>
                                                    </tr>
                                                    <tr>
                                                        <td align='center'>
                                                            <table align='center' border='0' cellpadding='0' cellspacing='0' class='display-width' width='100%'>
                                                                <tr>
                                                                    <td width='150'>

                                                                        <!--TABLE LEFT-->
                                                                        <!--[if gte mso 9]>
                                                                        </td><td>
                                                                        <![endif]-->
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height='100'></td>
                                                    </tr>
                                                    <tr>
                                                        <td align='center'>
                                                            <table align='center' border='0' cellpadding='0' cellspacing='0' class='display-width' width='100%'>
                                                                <tr>
                                                                    <td align='center' class='heading' style='color:#ffffff;font-family:Segoe UI, Helvetica Neue, Arial, Verdana, Trebuchet MS, sans-serif;font-size:30px;font-weight:600;letter-spacing:1px;line-height:40px;text-transform:uppercase;'>
                                                                        <multi label='Title'>Verify <span style='color:#6ec8c7;'>Account</span></multi></span>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td height='20'></td>
                                                                </tr>
                                                                <tr>
                                                                    <td align='center'>
                                                                        <table align='center' border='0' cellpadding='0' cellspacing='0' class='display-width' width='80%'>
                                                                            <tbody>
                                                                            <tr>
                                                                                <td align='center' class='MsoNormal' style='color:#ffffff;font-family:Segoe UI, Helvetica Neue, Arial, Verdana, Trebuchet MS, sans-serif; font-size:16px; line-height:26px;'>
                                                                                    <multi label='Content'>Hallo, ${username} <br>
                                                                                        Silahkan Klik tombol berikut untuk verifikasi email anda</multi>
                                                                                </td>
                                                                            </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td height='30'></td>
                                                                </tr>
                                                                <tr>
                                                                    <td align='center'>
                                                                        <table align='center' border='0' cellpadding='0' cellspacing='0' class='display-width' width='42%' style='width:auto !important;'>
                                                                            <tr>
                                                                                <td align='center' valign='middle' class='button-width'>
                                                                                    <table align='center' bgcolor='#6ec8c7' border='0' cellspacing='0' cellpadding='0' class='display-button textbutton' style='border-radius:5px;'> <!-- USING TABLE AS BUTTON -->
                                                                                        <tr>
                                                                                            <td align='center' valign='middle' class='MsoNormal' style='color:#333333;font-family:Segoe UI,sans-serif,Arial,Helvetica,Lato;font-size:13px;font-weight:600;letter-spacing:1px;padding:7px 15px;text-transform:uppercase;'>
                                                                                                <a href='http://localhost:3000/web/verify/${token}' style='color:#333333;text-decoration:none;' editable label='Verify Your Account'>Verify Your Account</a>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height='100'></td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <!--SECTION TABLE-600 ENDS-->
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--[if gte mso 9]> </v:textbox> </v:rect> <![endif]-->
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <!--SECTION TABLE-680 ENDS-->
                </td>
            </tr>
            </tbody>
        </table>
        <!-- HEADER BANNER ENDS -->

    </module>

</modules>


</body>
</html>`
                                    };
                                    transpoter.sendMail(mailOption, (err, info) => {
                                        if (err) return console.error(err);
                                        res.status(201).json({
                                            message: `User ${username} successfully Created! Please Verify Your Email`
                                        });
                                    });
                                }
                            })
                        }
                    }
                );
            });
        });
    }
};
exports.verify = (req, res) => {
    user.findOneAndUpdate(
        {token: req.params.token},
        {email_st: 1,token:null},
        {'new':true} //based on https://stackoverflow.com/questions/33992359/mongoosastic-findoneandupdate-not-indexing-in-elasticsearch
    ).select('+token').exec(err => {
        if (err)
            return res.status(500).json({
                err: err
            });
        return res.status(200).render("email");
    });
};
exports.checkemail = (req, res, next) => {
    user.count({email: req.body.email}, (err, c) => {
        res.status(c ? 500 : 200).send({
            message: c ? "Email tersedia" : ""
        });
    });
};
exports.checkusername = (req, res) => {
    user.count({username: req.body.username}, (err, c) => {
        res.status(c ? 500 : 200).send({
            message: c ? "Username tersedia" : ""
        });
    });
};
exports.checktoken = (req, res) => {
    jwt.verify(req.body.token, "ysn852jd48", (err, data) => {
        if (err) {
            res.status(500).send({
                err: err
            });
            return
        }
        user.findOne({_id: data.id}).exec((err,data) => {
            jwt.sign({
                    id: data._id,
                    username: data.username,
                    email: data.email
                },
                "ysn852jd48",
                {expiresIn: "24h"}, (err, token) => {
                    res.status(200).send({
                        token: token
                    })
                })
        });
    })
};
