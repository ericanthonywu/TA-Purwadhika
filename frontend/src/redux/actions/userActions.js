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
