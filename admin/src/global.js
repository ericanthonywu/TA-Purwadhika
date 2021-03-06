import {toast} from "react-toastify";

const secure = false;
const host = "localhost";
const port = "3000";
export const backend_url = `http${secure ? "s" : ""}://${host}:${port}/`;
export const api_url = `${backend_url}admin/`;
export const base_url = window.location.origin + "/";
export const post_url = `${backend_url}uploads/post/`;
export const profile_url = `${backend_url}uploads/profile_picture/`;
export const frontend_url = `http://localhost:3001/`;
export const err = err => {
    switch (err.response.status) {
        case 419:
            toast.error("session expired");
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            localStorage.removeItem('id');
            window.reload()
            break;
    }
}
