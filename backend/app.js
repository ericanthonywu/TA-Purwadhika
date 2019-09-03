const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();
const io = require('socket.io')();
const cors = require('cors');
const jwt = require('jsonwebtoken');
//model
const model = require('./model');
const Post = model.post;
const User = model.user;
app.io = io;

io.on("connection", socket => {
    const {token} = socket.handshake.query;
    let userdata = {};
    if(token) {
        jwt.verify(token, "ysn852jd48", (err, data) => {
            if (err) {
                io.sockets.emit('error',"error");
            }
            userdata = err ? null : data;
        })
    }

    socket.on('send chat',msg => {
        io.sockets.emit('show chat',msg);
        console.log(msg)
    })
});

app.use((req, res, next) => {
    req.io = io;
    next()
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('uploads')); //ngasih akses folder uploads

app.use('/web', indexRouter);
app.use('/mobile', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
