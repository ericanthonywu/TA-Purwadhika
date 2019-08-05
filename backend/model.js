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
    token: {type: String, unique: true},
    status: {type: String, default: "This user has no status yet"},
    profilepicture: {type: String, default: "https://github.githubassets.com/favicon.ico"}
}, {timestamps: true});

exports.user = mongoose.model('user', userSchema);

const post = new mongoose.Schema({

})

const chatRoom = new mongoose.Schema({
    fromID: {type: schema.Types.ObjectId, ref: 'user'},
    msg: [{type: String}],
    toID: {type: schema.Types.ObjectId, ref: 'user'},
}, {timestamps: true});

exports.chatroom = mongoose.model('chatroom', chatRoom);
