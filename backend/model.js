const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/react', {
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
    token: {type: String, unique: true},
    status: {type: String, default: "This user has no status yet"},
    profilepicture: {type: String, default: "https://github.githubassets.com/favicon.ico"}
}, {timestamps: true});

exports.user = mongoose.model('user', userSchema);

const chatRoom = new mongoose.Schema({
    fromID: {type: schema.Types.ObjectId, ref: 'user'},
    msg: [{type: String}],
    toID: {type: schema.Types.ObjectId, ref: 'user'},
}, {timestamps: true});

exports.chatroom = mongoose.model('chatroom', chatRoom);

const groupChatRoom = new mongoose.Schema({
    fromID: {type: schema.Types.ObjectId, ref: 'user'},
    msg: [{text: String}],
}, {timestamps: true});

exports.groupchatroom = mongoose.model('groupchatroom', groupChatRoom);

const memberGroupChatRoom = new mongoose.Schema({
    groupID: [
        {type: schema.Types.ObjectId, ref: 'groupchatroom'}
    ],
    userID: [
        {type: schema.Types.ObjectId, ref: 'user'}
    ],
}, {timestamps: true});

exports.membergroupchatroom = mongoose.model('membergroupchatroom', memberGroupChatRoom);

const friendList = new mongoose.Schema({
    userID: {
        type: schema.Types.ObjectId, ref: 'user'
    },
    friendID: [{
        type: schema.Types.ObjectId, ref: 'user'
    }]
}, {timestamps: true});

exports.friendList = mongoose.model('friendList', friendList);

const friendRequest = new mongoose.Schema({
    userID: {
        type: schema.Types.ObjectId, ref: 'user'
    },
    friendID: [{
        type: schema.Types.ObjectId, ref: 'user'
    }]
}, {timestamps: true});

exports.friendRequest = mongoose.model('friendRequest',friendRequest);