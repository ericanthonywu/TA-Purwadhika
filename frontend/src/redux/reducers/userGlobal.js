const globalstate = {
    nav_active_bar: 0,
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
        default:
            return globalstate
    }
};
