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
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email_st: {type: Number, default: 0},
    nickname: {type: String},
    profilepicture: {type: String, default: "https://github.githubassets.com/favicon.ico"},
    follower: [{type: mongoose.Schema.Types.ObjectId,ref: 'user'}],
    following: [{type: mongoose.Schema.Types.ObjectId,ref: 'user'}]
}, {timestamps: true});

exports.user = mongoose.model('user', userSchema);

const postSchema = new mongoose.Schema({
    image: [{type: String, required: true, unique: true}],
    comments: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        comments: {type: String},
        like: {type: Number},
        time: {type: Date, default: Date.now}
    }],
    caption: {type: String},
    user: {type: mongoose.Schema.Types.ObjectId,ref: 'user'}
}, {timestamps: true});

exports.post = mongoose.model('post', postSchema);
