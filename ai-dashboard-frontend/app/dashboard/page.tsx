"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getProtectedData, logoutUser } from "@/utils/api";
import { Task, useTaskContext } from "@/app/context/TaskContext";
import EditTaskModal from "@/components/EditTaskModal";

export default function DashboardPage() {
  const router = useRouter();
  const { tasks, loading, addTask, removeTask } = useTaskContext();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const taskRefs = useRef<{ [key: number]: HTMLLIElement | null }>({});

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
        router.push("/login"); // redirects to login if not authenticated
      });
  }, []);

  // Handles adding a new task
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
    setEditingTask(task);
    setTimeout(() => {
      taskRefs.current[task.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // Delete task with confirmation popup
  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await removeTask(taskId);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  // Handles user logout: calls backend API, then redirects to login page
  const handleLogout = async () => {
    try {
      await logoutUser(); // This should clear the cookie on the server side
      router.push("/login");  // Redirects to the login page
    } catch(error) {
      console.error("Logout failed:", error);
    }
  }; 

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white ">
      {/* Edit Modal */}
      {editingTask && (
        <EditTaskModal 
          task={editingTask} 
          onClose={() => setEditingTask(null)} 
        />
      )}

      {/* Header section with Logout Button*/}
      <header className="relative max-w-5xl mx-auto w-full mb-8 px-4 ">
  <div className="text-center">
    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide">
      Welcome, <span className="text-blue-400">{user ? user.name : "Loading..."}</span>!
    </h1>
    <p className="mt-2 text-lg text-gray-300">
      {user ? `Role: ${user.role.toUpperCase()}` : ""}
    </p>
  </div>

  <div>
    <button
      onClick={handleLogout}
      className="absolute top-4 right-4  bg-red-500 hover:bg-red-600 transition duration-200 text-white font-bold py-2 px-4 rounded-lg shadow-md "
    >
      Logout
    </button>
  </div>
</header>


      {/* Task Input Form */}
      <section className="max-w-lg mx-auto bg-gray-800 bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700 mb-8">
        <h2 className="text-xl font-semibold text-blue-300 text-center">Add New Task</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mt-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 mt-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <button
          onClick={handleAddTask}
          className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg shadow-md hover:opacity-90 transition duration-200"
        >
          Add Task
        </button>
      </section>

      {/* Task List */}
      <section className="max-w-3xl mx-auto bg-gray-800 bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-white text-center mb-4">Your Tasks</h2>
        {loading ? (
          <p className="text-center text-gray-400">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-400">No tasks found.</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                ref={(el) => { taskRefs.current[task.id] = el; }}
                className="p-4 bg-gray-700 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0"
              >
                <div>
                  <h3 className="text-lg font-semibold text-blue-300">{task.title}</h3>
                  <p className="text-sm text-gray-400">{task.description}</p>
                  <span
                    className={`text-sm font-semibold ${
                      task.status === "Completed" ? "text-green-400" : "text-yellow-400"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="bg-blue-500 px-4 py-2 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="bg-red-500 px-4 py-2 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

