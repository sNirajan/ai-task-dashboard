"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchTasks, createTask, updateTask, deleteTask } from "../../utils/api";

// Defining Task Type
export interface Task {
    id: number;
    title: string;
    description: string;
    status: "To-Do" | "In-Progress" | "Completed";  // Restricted status to known values 
    createdAt?: string;
    updatedAt?: string;
}

// Defining Context Type
interface TaskContextType {
    tasks: Task[];
    loading: boolean;
    addTask: (taskData: { title: string; description: string }) => Promise<void>;
    editTask: (taskId: number, taskData: Task) => Promise<void>;
    removeTask: (taskId: number) => Promise<void>;
}

// Creating Task Context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Task Provider Component
export const TaskProvider = ({ children }: { children: ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>([]); // Store all tasks
    const [loading, setLoading] = useState(false); // Show loading state

    // Load tasks when the app starts
    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const response = await fetchTasks();
            setTasks(response.data);    // Store fetched tasks
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to add a new task
    const addTask = async (taskData: { title: string; description: string }) => {
        try {
            const response = await createTask(taskData);

            // Ensure that the response data matches the `Task` type
            const newTask: Task = {
                id: response.data.id,   // Assigned by backend
                title: response.data.title,
                description: response.data.description,
                status: response.data.status || "To-Do",
                createdAt: response.data.createdAt || new Date().toISOString(),
                updatedAt: response.data.updatedAt || new Date().toISOString(),
            };

            setTasks([...tasks, newTask]); // Update the state
        } catch (error) {
            console.error("Failed to add task:", error);
        }
    };

    // Function to update a task
    const editTask = async (taskId: number, taskData: Task) => {
        try {
            await updateTask(taskId, taskData);
            loadTasks();    // Reload tasks after udpdating
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    // Function to delete a task
    const removeTask = async (taskId: number) => {
        try {
            await deleteTask(taskId);
            setTasks(tasks.filter(task => task.id !== taskId)); // Remove task from state
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, loading, addTask, editTask, removeTask }}>
            {children}
        </TaskContext.Provider>
    );
};

// Custom Hook to use the Task Context
export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTaskContext must be used within a TaskProvider");
    }
    return context;
};