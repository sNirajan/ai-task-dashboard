"use client";

import { useState } from "react";
import { useTaskContext } from "@/app/context/TaskContext";

interface EditTaskModalProps {
    task: { id: number; title: string; description: string; status: "To-Do" | "In-Progress" | "Completed";};
    onClose: () => void;
}

export default function EditTaskModal({ task, onClose }: EditTaskModalProps) {
    const { editTask } = useTaskContext();
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [status, setStatus] = useState(task.status);

    // Handle task update
    const handleUpdate = async () => {
        await editTask(task.id, { ...task, title, description, status });
        onClose(); // Close modal after updating
    };

    return (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md z-50" // Ensures modal is visible on top
        >
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 border border-gray-700 relative z-50">
            <h2 className="text-xl font-bold text-white">Edit Task</h2>

            {/* Title Input */}
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full p-2 mt-3 bg-gray-700 text-white rounded-lg"
            />

            {/* Description Input */}
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full p-2 mt-3 bg-gray-700 text-white rounded-lg"
            />

            {/* Status Dropdown */}
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value as "To-Do" | "In-Progress" | "Completed")} 
              className="w-full p-2 mt-3 bg-gray-700 text-white rounded-lg"
            >
              <option value="To-Do">To-Do</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button onClick={handleUpdate} className="bg-blue-500 px-4 py-2 text-white rounded">Save</button>
              <button onClick={onClose} className="bg-gray-600 px-4 py-2 text-white rounded">Cancel</button>
            </div>
          </div>
        </div>
    );
}
