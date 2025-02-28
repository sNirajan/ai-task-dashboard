import axios from "axios";

// Centralizing all API calls for better organization

// Base API instance with backend URL
const API = axios.create({
    baseURL: "http://localhost:5000/api",   // Backend URL
    withCredentials: true,          // Ensure cookies (JWT) are included in requests
});

export const registerUser = async (name: string, email: string, password: string) => {
    return API.post('/auth/register', { name, email, password });
};

export const loginUser = async (email: string, password: string) => {
    return API.post('/auth/login', { email, password });
};

export const logoutUser = async () => {
    return API.post('/auth/logout');
}

export const getProtectedData = async () => {
    return API.get('/protected');   // Fetch user data from the backend
}

// Task related API calls

// Function to fetch all tasks from the backend
export const fetchTasks = async () => {
    return API.get("/tasks", {
        withCredentials: true,      // Ensuring JWT cookies are sent
    });
};

// Function to create a new task
export const createTask = async (taskData: { title: string, description?: string }) => {
    return API.post("/tasks", taskData);
};

// Function to update a task
export const updateTask = async (taskId: number, taskData: { title?: string; description?: string; status?: string }) => {
    return API.put(`/tasks/${taskId}`, taskData);
}

// Function to delete a task
export const deleteTask = async (taskId: number) => {
    return API.delete(`/tasks/${taskId}`);
};

export default API;