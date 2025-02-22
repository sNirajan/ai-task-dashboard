"use client";

import { useEffect, useState } from "react";
import { getProtectedData } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    getProtectedData().then((res) => {
      setUser(res.data.user);
    }).catch(() => {
      router.push("/login");  // Redirect if not authenticated
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">
        {user ? `Welcome, ${user.name}!` : "Loading..."}
      </h1>
      <p className="mt-4 text-lg">
        {user ? `You are logged in as: ${user.role}` : ""}
      </p>

      <div className="mt-6 flex space-x-4">
        <button className="px-6 py-3 bg-blue-500 rounded-lg">View Tasks</button>
        {user?.role === "admin" && (
          <button className="px-6 py-3 bg-red-500 rounded-lg">Manage Users</button>
        )}
      </div>
    </div>
  );
}
