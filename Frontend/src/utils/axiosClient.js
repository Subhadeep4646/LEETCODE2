import axios from 'axios';

const BASE_URL =import.meta.env.MODE === "development" ? "http://localhost:1234/" : "/";
const axiosClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Include cookies in requests
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default axiosClient;