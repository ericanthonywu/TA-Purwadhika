const globalstate = {
    token: "",
    username: "",
    loggedin: false
};

export default (state = globalstate, action) => {
    switch (action.type) {
        case "login":
            return {...globalstate, token: action.payload.token, username: action.payload.username, loggedin: true};
        case "logout":
            return {...globalstate, token: "", username: "", loggedin: false};
        case "setLoggedIn":
            return {...globalstate, loggedin: true,username: action.payload.username,token: action.payload.token};
        case 'updateToken':
            return {...globalstate,token:action.payload.token};
        default:
            return globalstate
    }
};
