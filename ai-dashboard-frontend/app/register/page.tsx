"use client";
// The above line lets Next.js know this is a client component (can use state, etc.)

import { useState } from "react";
// useForm, SubmitHandler, and FieldErrors from react-hook-form help with form validation
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { registerUser } from "@/utils/api"; 
import { useRouter } from "next/navigation"; // For page navigation
import { toast } from "react-toastify";      // For showing success/error messages

// RegisterFormData defines the shape of form data
// We ask for a repeated password (confirmPassword) to ensure the user typed it correctly.
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  /*
    useForm is our main form hook. 
    - mode: "onChange" ensures that errors appear as user types (good UX)
    - we also use watch() to compare password and confirmPassword fields.
  */
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({ mode: "onChange" });

  // We'll track a loading state to disable the submit button while registering.
  const [loading, setLoading] = useState(false);

  // Allows navigation after successful registration (e.g., to /login)
  const router = useRouter();

  /*
    onSubmit is called once the form is valid according to our rules. 
    We'll create the user via our API and then redirect or show an error.
  */
  const onSubmit: SubmitHandler<RegisterFormData> = async (formData) => {
    setLoading(true);
    try {
      // Attempt to create user via backend API
      await registerUser(formData.name, formData.email, formData.password);
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 500);
    } catch (error: any) {
      // If something fails, show error message (API or network)
      toast.error(error.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  /*
    onError is optional: we can handle "all fields" errors in a single place if desired.
    For now, we'll rely on inline error messages.
  */
  const onError = (errors: FieldErrors<RegisterFormData>) => {
    console.log("Validation errors:", errors);
  };

  // Our password value is watched so we can compare it to confirmPassword
  const passwordValue = watch("password");

  return (
    <main
      className="
        min-h-screen 
        flex 
        items-center 
        justify-center 
        relative 
        text-white
      "
      // Modern gradient background
      style={{
        background: "linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)",
      }}
    >
      {/* Decorative blurred circle for aesthetic */}
      <div
        className="
          absolute 
          w-96 
          h-96 
          rounded-full 
          bg-purple-500 
          opacity-20 
          blur-3xl 
          -top-32 
          -left-32
        "
      />

      {/* Glass-like container */}
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
        {/* Title with subtle glow or pulse */}
        <h2 className="text-3xl font-bold text-center mb-6 text-[#00D4FF] animate-pulse">
          Register
        </h2>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block mb-1 text-md text-[#48CAE4]">Name</label>
            <input
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters long",
                },
              })}
              placeholder="Your Name"
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
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

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

          {/* Password Field 
              Minimum 8 chars, at least 1 uppercase, 1 number, 1 symbol
          */}
          <div>
            <label className="block mb-1 text-md text-[#48CAE4]">Password</label>
            <input
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                  message:
                    "Password must be at least 8 chars, with 1 uppercase, 1 number, 1 symbol",
                },
              })}
              type="password"
              placeholder="Password"
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

          {/* Confirm Password Field 
              Must match the 'password' value 
          */}
          <div>
            <label className="block mb-1 text-md text-[#48CAE4]">Confirm Password</label>
            <input
              {...register("confirmPassword", {
                required: "Please retype your password",
                validate: (value) =>
                  value === passwordValue || "Passwords do not match",
              })}
              type="password"
              placeholder="Retype Password"
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
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
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
              hover:opacity-90 
              transition 
              duration-200 
              focus:outline-none
            "
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </main>
  );
}
