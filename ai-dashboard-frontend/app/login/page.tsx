"use client";

import { useState } from "react";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { loginUser } from "@/utils/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

// LoginFormData only needs email + password
interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  // Setting up react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ mode: "onChange" });

  // Track loading state for the login process
  const [loading, setLoading] = useState(false);

  // Use Next.js navigation to redirect post-login
  const router = useRouter();

  // Called when the form passes all validations
  const onSubmit: SubmitHandler<LoginFormData> = async (formData) => {
    setLoading(true);
    try {
      // Login user via backend API
      await loginUser(formData.email, formData.password);
      toast.success("Login successful! Redirecting to dashboard...");
      // Redirect after a short delay
      setTimeout(() => router.push("/dashboard"), 500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  // Optional error handler
  const onError = (errors: FieldErrors<LoginFormData>) => {
    console.log("Validation errors:", errors);
  };

  return (
    <main
      className="
        min-h-screen 
        flex 
        items-center 
        justify-center 
        overflow-hidden
        relative 
        text-white
      "
      // Modern gradient background
      style={{
        background: "linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)",
      }}
    >
      {/* Decorative bubble shape */}
      <div
        className="
          absolute 
          w-96 
          h-96 
          rounded-full 
          bg-[#00D4FF] 
          opacity-20 
          blur-3xl 
          -bottom-32 
          -right-32
          
        "
      />

      {/* Glass Card Container */}
      <div
        className="
          relative 
          z-10 
          w-[22rem] 
          p-8 
          bg-white/10 
          backdrop-blur-xl 
          border 
          border-white/10 
          shadow-2xl 
          rounded-xl
        "
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-[#00D4FF] animate-pulse">
          AI Task Dashboard
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Smart AI-powered task management system for your productivity.
        </p>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block mb-1 text-md text-[#48CAE4]">Email</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Please enter a valid email address",
                },
              })}
              type="email"
              placeholder="you@example.com"
              className="
                w-full 
                p-3 
                text-sm
                text-gray-300
                bg-gray-800 
                border 
                border-gray-700 
                text-white 
                rounded-md 
                focus:outline-none 
                focus:ring-2 
                focus:ring-[#00D4FF]
                transition
              "
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-1 text-md text-[#48CAE4]">Password</label>
            <input
              {...register("password", {
                required: "Password is required",
                // minLength: {
                //   value: 8,
                //   message: "Password must be at least 8 characters long",
                // },
              })}
              type="password"
              placeholder="Your Password"
              className="
                w-full 
                p-3 
                text-sm
                text-gray-300
                bg-gray-800 
                border 
                border-gray-700 
                text-white 
                rounded-md 
                focus:outline-none 
                focus:ring-2 
                focus:ring-[#00D4FF]
                transition
              "
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full 
              p-3 
              bg-gradient-to-r 
              from-[#00D4FF] 
              to-[#7F00FF] 
              text-white 
              font-semibold 
              rounded-md 
              hover:opacity-70
              transition 
              duration-200 
              focus:outline-none
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        {/* 🔹 Register Link */}
        <p className="text-center text-gray-200 mt-6">
          New here?{" "}
          <Link href="/register" className="text-blue-300 hover:underline">
            Create an account</Link>
        </p>


      </div>
    </main>
  );
}
