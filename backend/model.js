const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sosmed', {
    useNewUrlParser: true,
    keepAlive: true,
    keepAliveInitialDelay: 300000
}).then(r => {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
});
const schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true, lowercase: true, trim: true},
    password: {type: String, required: true},
    email_st: {type: Number, default: 0},
    nickname: {type: String},
    profilepicture: {type: String, default: "default.jpg"},
    token: {type: String, unique: true},
    follower: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
}, {timestamps: true});

exports.user = mongoose.model('user', userSchema);

const postSchema = new mongoose.Schema({
    image: [{type: String, required: true, unique: true}],
    comments: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        comments: {type: String},
        like: {type: Number, default: 0},
        time: {type: Date, default: Date.now}
    }],
    caption: {type: String},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    like: [{type: mongoose.Schema.Types.ObjectId, ref: 'user', default: 0}]
}, {timestamps: true});

exports.post = mongoose.model('post', postSchema);

const notificationSchema = new mongoose.Schema({
    notification: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'post'}
});

exports.notification = mongoose.model('notification',notificationSchema);
