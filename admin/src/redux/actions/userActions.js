export const login = payload => {
    return {
        type: 'login',
        payload:payload
    }
}
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    return {
        type: 'logout'
    }
}
export const setloggedin = payload => {
    return {
        type: 'setLoggedIn',
        payload:payload
    }
};
