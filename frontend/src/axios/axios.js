import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:8000/api/v1",
});

export const axiosPrivate = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
});
