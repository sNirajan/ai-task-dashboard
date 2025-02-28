"use client"; // ✅ Ensures this component runs only on the client-side

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProtectedData } from "@/utils/api";
import { useTaskContext } from "../context/TaskContext";
import { FiCheckCircle, FiUsers, FiClipboard } from "react-icons/fi"; // Icons for UI

export default function DashboardPage() {
  const router = useRouter();
  const { tasks, loading } = useTaskContext();  // Fetch tasks - Get tasks from context
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);


  //  Fetch user data when the component loads
  useEffect(() => {
    getProtectedData()
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user); // Ensures that correct user data is stored
        } else {
          console.error("User data not found in response:", res.data);
        }
      })
      .catch(() => {
        router.push("/login"); // Redirects to login if not authenticated
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      {/*  Welcome message */}
      <h1 className="text-4xl font-bold text-center text-blue-400">
        {user ? `Welcome, ${user.name || "Guest"}!` : "Loading..."}
      </h1>

      {/*  Display user role */}
      <p className="mt-4 text-lg text-gray-300">
        {user ? `You are logged in as: ${user.role.toUpperCase()}` : ""}
      </p>

      {/*  Task List */}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Your Tasks</h2>

        {/* Show loading message */}
        {loading && <p className="text-gray-400">Loading tasks...</p>}

        {/* Show tasks if available */}
        {tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="p-4 bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-blue-300">{task.title}</h3>
                <p className="text-gray-400">{task.description}</p>
                <p className="text-sm text-gray-500">Status: {task.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="text-gray-400">No tasks found.</p>
        )}
      </div>
    </div>
  );
}