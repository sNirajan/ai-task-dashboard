import axios from "axios";

// Centralizing all API calls for better organization

// Base API instance with backend URL
const api = axios.create({
    baseURL: "http://localhost:5000",   // Backend URL
    withCredentials: true,          // Ensure cookies (JWT) are included in requests
});

export const registerUser = async (name: string, email: string, password: string) => {
    return api.post('/api/auth/register', { name, email, password });
};

export const loginUser = async (email: string, password: string) => {
    return api.post('/api/auth/login', { email, password });
};

export const logoutUser = async () => {
    return api.post('/api/auth/logout');
}

export const getProtectedData = async () => {
    return api.get('api/protected');   // Fetch user data from the backend
}

// Task related API calls
export const fetchTasks = async () => {
    return api.get("/tasks");
}

export const createTask = async (taskData: { title: string, description?: string }) => {
    return api.post("/tasks", taskData);
};

export const updateTask = async (taskId: number, taskData: { title?: string; description?: string; status?: string }) => {
    return api.put(`/tasks/${taskId}`, taskData);
}

export const deleteTask = async (taskId: number) => {
    return api.delete(`/tasks/${taskId}`);
};

export default api;