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
    bio: {type: String},
    notification: [{
        id: {type: mongoose.Schema.Types.ObjectId},
        message: {type: String, required: true},
        user: {type: mongoose.Schema.Types.ObjectId, ref:'user',default: null},
        post: {type: mongoose.Schema.Types.ObjectId, ref:'post',default: null},
        report: {type: Boolean, default: false},
        read: {type: Boolean, default: false},
        time: {type: Date, default: Date.now}
    }],
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
    ],
    populate:[
        {path:'follower',select:''}
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

const chatSchema = new mongoose.Schema({
    participans:[{type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true}],
    message:[{
        sender: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
        message: {type: String,required: true},
        read: {type: Boolean, default: false},
        time: {type: Date, default: Date.now()}
    }]
});
exports.chat = mongoose.model('chat',chatSchema);
