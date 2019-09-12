const secure = false;
const host = "localhost";
const port = "3000";
export const backend_url = `http${secure ? "s" : ""}://${host}:${port}/`;
export const api_url = `${backend_url}web/`;
export const base_url = window.location.origin + "/";
export const post_url = `${backend_url}uploads/post/`;
export const profile_url = `${backend_url}uploads/profile_picture/`;

function truncateToDecimals(num, dec = 2) {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
}

export const followformat = num => {
    if (num > 10000 && num < 1000000) {
        if (num < 100000) {
            num = truncateToDecimals(num / 1000, 1);
            if (num % 1 === 0) {
                num = Math.round(num)
            }
        } else {
            num = Math.round(num / 1000)
        }
        num = Math.round(num);
        return num + "k";
    } else if (num > 1000000 && num < 100000000) {
        if (num < 100000000) {
            num = truncateToDecimals(num / 1000000, 1);
            if (num % 1 === 0) {
                num = Math.round(num)
            }
        }
        return num + "m";
    }else{
        return num
    }
};
