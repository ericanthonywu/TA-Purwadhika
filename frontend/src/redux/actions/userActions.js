export const login = payload => {
    return {
        type: 'login',
        payload:payload
    }
}
export const logout = () => {
    return {
        type: 'logout'
    }
}
export const setloggedin = payload => {
    return {
        type: 'setLoggedIn',
        payload:payload
    }
}
export const updateToken = payload => {
    return {
        type: 'updateToken',
        payload:payload
    }
}
