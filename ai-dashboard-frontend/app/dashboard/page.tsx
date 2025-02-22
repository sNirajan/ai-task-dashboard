"use client"; // ✅ Ensures this component runs only on the client-side

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProtectedData } from "@/utils/api";
import { FiCheckCircle, FiUsers, FiClipboard } from "react-icons/fi"; // Icons for UI

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  // 🔹 Fetch user data when the component loads
  useEffect(() => {
    getProtectedData()
      .then((res) => {
        if (res.data.user){
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
      {/* 🔹 Welcome message */}
      <h1 className="text-4xl font-bold text-center text-blue-400">
        {user?  `Welcome, ${user.name || "Guest"}!` : "Loading..."}
      </h1>

      {/* 🔹 Display user role */}
      <p className="mt-4 text-lg text-gray-300">
        {user ? `You are logged in as: ${user.role.toUpperCase()}` : ""}
      </p>

       {/* 🔹 Dashboard Cards */}
       <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* View Tasks */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-md flex flex-col items-center">
        <FiClipboard size={40} color="rgb(96, 165, 250)" />
          <h2 className="text-lg font-semibold mt-2">View Tasks</h2>
        </div>

        {/* Create New Task */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md flex flex-col items-center">
        <FiCheckCircle size={40} color="white" />
          <h2 className="text-lg font-semibold mt-2">Create Task</h2>
        </div>

        {/* Manage Users (Admins Only) */}
        {user?.role === "admin" && (
          <div className="p-6 bg-red-500 rounded-lg shadow-md flex flex-col items-center">
             <FiUsers size={40} color="white" />
            <h2 className="text-lg font-semibold mt-2">Manage Users</h2>
          </div>
        )}
      </div>
    </div>
  );
}
