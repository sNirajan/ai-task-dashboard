import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
});

export const registerUser = async (name: string, email:string, password: string) => {
    return api.post('/api/auth/register', {name, email, password});
};

export const loginUser = async (email: string, password: string) => {
    return api.post('/api/auth/login', {email, password});
};

export const logoutUser = async() => {
    return api.post('/api/auth/logout');
}

export const getProtectedData = async() => {
    return api.get('api/auth/protected');
}