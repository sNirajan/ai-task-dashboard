"use client"; // Ensures this runs only on the client-side

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProtectedData } from "@/utils/api";
import { useTaskContext } from "@/app/context/TaskContext"; // Ensure Task Context is used

export default function DashboardPage() {
  const router = useRouter();
  const { tasks, loading } = useTaskContext(); // Fetch tasks from context
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  // 🔹 Fetch user data when the component loads
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      {/* Welcome message */}
      <h1 className="text-4xl font-bold text-blue-400">{user ? `Welcome, ${user.name}!` : "Loading..."}</h1>
      <p className="mt-2 text-lg text-gray-300">{user ? `You are logged in as: ${user.role.toUpperCase()}` : ""}</p>

      {/*  Task Section */}
      <div className="mt-8 w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Your Tasks</h2>
        {loading ? (
          <p className="text-gray-400">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-400">No tasks found.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="p-3 bg-gray-700 rounded-md shadow-sm">
                <h3 className="text-lg font-medium text-blue-300">{task.title}</h3>
                <p className="text-sm text-gray-400">{task.description}</p>
                <span className={`text-sm ${task.status === "Completed" ? "text-green-400" : "text-yellow-400"}`}>
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
