const globalstate = {
    token: "",
    username: "",
    loggedIn: false,
    role: "",
    _id: 0
};

export default (state = globalstate, action) => {
    switch (action.type) {
        case "login":
            return {
                ...globalstate,
                token: action.payload.token,
                username: action.payload.username,
                _id: action.payload.id,
                role: action.payload.role,
                loggedIn: true
            };
        case "logout":
            return {...globalstate, token: "", username: "", loggedin: false, _id: 0};
        case "setLoggedIn":
            return {
                ...globalstate,
                token: action.payload.token,
                username: action.payload.username,
                _id: action.payload.id,
                role: action.payload.role,
                loggedIn: true
            }
        default:
            return globalstate
    }
};
