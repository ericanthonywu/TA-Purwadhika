const secure = false;
const host = "localhost";
const port = "3000";
export const backend_url = `http${secure ? "s" : ""}://${host}:${port}/`;
export const api_url = `${backend_url}admin/`;
export const base_url = window.location.origin + "/";
export const post_url = `${backend_url}uploads/post/`;
export const profile_url = `${backend_url}uploads/profile_picture/`;