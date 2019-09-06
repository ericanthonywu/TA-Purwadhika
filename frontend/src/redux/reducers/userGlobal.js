const globalstate = {
    token: "",
    username: "",
    loggedin: false,
    profilepicture: "",
    _id: 0
};

export default (state = globalstate, action) => {
    switch (action.type) {
        case "login":
            return {
                ...globalstate,
                token: action.payload.token,
                username: action.payload.username,
                _id: action.payload._id,
                profilepicture: action.payload.profilepicture,
                loggedin: true
            };
        case "logout":
            return {...globalstate, token: "", username: "", loggedin: false, _id: 0};
        case "setLoggedIn":
            return {
                ...globalstate,
                loggedin: true,
                username: action.payload.username,
                token: action.payload.token,
                _id: action.payload._id,
                profilepicture: action.payload.profilepicture,
            };
        case 'updateToken':
            return {...globalstate, token: action.payload.token};
        case 'updateProfile':
            return {...state, profilepicture: action.payload.profilepicture};
        default:
            return globalstate
    }
};
