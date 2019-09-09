const mongoose = require('mongoose');
const elastic_search = require('mongoosastic');
mongoose.connect('mongodb://localhost/sosmed', {
    useNewUrlParser: true,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useFindAndModify: false,
    useCreateIndex: true
}).then(r => {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
});

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true, lowercase: true, trim: true},
    password: {type: String, required: true, select: false},
    email_st: {type: Number, default: 0},
    nickname: {type: String},
    profilepicture: {type: String, default: "default.jpg"},
    token: {type: String, unique: true, select: false},
    follower: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    bio: {type: String}
}, {timestamps: true}).index({
    username: 'text',
    nickname: 'text'
}, {
    weights: { //apply index
        username: 5,
        nickname: 1
    }
}).plugin(elastic_search,{
    hosts: [
        'localhost:9200'
    ]
});

exports.user = mongoose.model('user', userSchema);

const postSchema = new mongoose.Schema({
    image: [{type: String, required: true, unique: true}],
    comments: [{
        id: {type: mongoose.Schema.Types.ObjectId},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        comments: {type: String},
        like: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
        time: {type: Date, default: Date.now},
        reply: [{
            id: {type: mongoose.Schema.Types.ObjectId},
            user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
            comments: {type: String},
            like: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
            time: {type: Date, default: Date.now},
        }]
    }],
    caption: {type: String},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    like: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    status: {type: Number, default: 0}
}, {timestamps: true}).plugin(elastic_search,{
    hosts: [
        'localhost:9200'
    ]
});

exports.post = mongoose.model('post', postSchema);

const notificationSchema = new mongoose.Schema({
    notification: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    url: {type: String}
}, {timestamps: true}).plugin(elastic_search,{
    hosts: [
        'localhost:9200'
    ]
});

exports.notification = mongoose.model('notification', notificationSchema);
