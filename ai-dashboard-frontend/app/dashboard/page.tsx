"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getProtectedData } from "@/utils/api";
import { Task, useTaskContext } from "@/app/context/TaskContext";
import EditTaskModal from "@/components/EditTaskModal";

export default function DashboardPage() {
  const router = useRouter();
  const { tasks, loading, addTask, removeTask } = useTaskContext(); // Access task functions
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const taskRefs = useRef<{ [key: number]: HTMLLIElement | null }>({}); // Store task elements for scrolling

  // Fetch user data when the component loads
  useEffect(() => {
    getProtectedData()
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          console.error("User data not found in response:", res.data);
        }
      })
      .catch(() => {
        router.push("/login"); // Redirect to login if not authenticated
      });
  }, []);

  // Handle adding a new task
  const handleAddTask = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and Description cannot be empty");
      return;
    }
    await addTask({ title, description });
    setTitle("");
    setDescription("");
  };

  // Function to open the edit modal and scroll to the selected task
  const handleEditTask = (task: Task) => {
    setEditingTask(task); // Open the modal with selected task
    setTimeout(() => {
      taskRefs.current[task.id]?.scrollIntoView({ behavior: "smooth", block: "center" }); // Auto-scroll to task
    }, 100);
  };

  // Handle deleting a task with a confirmation popup
  const handleDeleteTask = async (taskId: number) => {
    // Show confirmation popup
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await removeTask(taskId);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8">

      {/* Display Edit Modal only when editingTask is set */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {/* Welcome Section */}
      <h1 className="text-5xl font-extrabold text-white tracking-wide mt-6">
        Welcome, <span className="text-blue-400">{user ? user.name : "Loading..."}</span>!
      </h1>
      <p className="mt-2 text-lg text-gray-400">{user ? `Role: ${user.role.toUpperCase()}` : ""}</p>

      {/* Task Input Form */}
      <div className="mt-8 w-full max-w-lg bg-gray-800 bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-blue-300">Add New Task</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mt-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 mt-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleAddTask}
          className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:opacity-80 transition"
        >
          Add Task
        </button>
      </div>

      {/* Task List Section */}
      <div className="mt-10 w-full max-w-3xl bg-gray-800 bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-white">Your Tasks</h2>

        {/* Loading State */}
        {loading ? (
          <p className="text-gray-400">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-400">No tasks found.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {tasks.map((task) => (
              <li key={task.id} ref={(el) => { taskRefs.current[task.id] = el; }} className="p-4 bg-gray-700 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-blue-300">{task.title}</h3>
                  <p className="text-sm text-gray-400">{task.description}</p>
                  <span className={`text-sm font-semibold ${task.status === "Completed" ? "text-green-400" : "text-yellow-400"}`}>
                    {task.status}
                  </span>
                </div>

                <div className="flex space-x-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditTask(task)}
                    className="bg-blue-500 px-4 py-2 text-white rounded-lg shadow-md hover:bg-blue-600 transition "
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteTask(task.id)} className="bg-red-500 px-4 py-2 text-white rounded-lg shadow-md hover:bg-red-600 transition" > Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
