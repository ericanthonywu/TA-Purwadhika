const secure = false;
const host = "localhost";
const port = "3000";
export const backend_url = `${secure ? "https" : "http"}://${host}:${port}/`;
export const api_url = `${backend_url}web/`;
export const base_url = window.location.origin+"/";
export const post_url = `${backend_url}uploads/post/`;
export const profile_url = `${backend_url}uploads/profile_picture/`;
