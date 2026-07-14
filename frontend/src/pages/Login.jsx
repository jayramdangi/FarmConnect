import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../authSlice";

// Schema validation for login (now includes mandi)
const loginSchema = z.object({
  emailId: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password should contain at least 6 characters"),
  role: z.enum(["farmer", "shop", "mandi"], {
    required_error: "Please select a role",
  }),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated , user} = useSelector((state) => state.auth);
  const [selectedRole, setSelectedRole] = useState("farmer");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: "farmer",
      emailId: "Rohit123@gmail.com",
      password: "1q2w3e4r5t6y",
    },
  });

 useEffect(() => {
  if (isAuthenticated && user) {
    // role can be "farmer", "shop", "mandi" (case-insensitive)
    const role = user.role?.toLowerCase?.() || "farmer";
    if (role === "shop") {
      navigate("/shop");
    } else if (role === "mandi") {
      navigate("/mandi/dashboard");
    } else {
      navigate("/farmer-query");
    }
  }
}, [isAuthenticated, user, navigate]);
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setValue("role", role, { shouldValidate: true });

    // Set different default values based on role
    if (role === "farmer") {
      setValue("emailId", "Rohit123@gmail.com", { shouldValidate: true });
      setValue("password", "1q2w3e4r5t6y", { shouldValidate: true });
    } else if (role === "shop") {
      setValue("emailId", "raju9595@gmail.com", { shouldValidate: true });
      setValue("password", "1q2w3e4r5t6y@jayDangi", { shouldValidate: true });
    } else if (role === "mandi") {
      setValue("emailId", "mandi@example.com", { shouldValidate: true });
      setValue("password", "mandi123", { shouldValidate: true });
    }
  };

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  const onRoleKeyDown = (e, role) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRoleChange(role);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="inline-flex items-center justify-center bg-green-700 p-4 rounded-full shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm md:text-base text-gray-700">
              Sign in to your AgriQuery account
            </p>
          </div>

          {/* Display authentication error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Testing note */}
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-center">
            <p className="font-medium">
              For testing: Select your role and click "Sign In"
            </p>
            <p className="text-sm mt-1">
              Credentials are pre‑filled for your convenience
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Role Selection */}
            <div className="md:w-1/3">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3 text-center">
                  Select Account Type
                </label>
                <div
                  role="radiogroup"
                  aria-label="Account type"
                  className="flex flex-col gap-3 p-2 bg-gray-50 rounded-lg"
                >
                  {/* Farmer Role Button */}
                  <div
                    role="radio"
                    tabIndex={0}
                    aria-checked={selectedRole === "farmer"}
                    onKeyDown={(e) => onRoleKeyDown(e, "farmer")}
                    onClick={() => handleRoleChange("farmer")}
                    className={`w-full cursor-pointer rounded-lg py-3 px-4 flex items-center gap-3 transition-transform transform focus:outline-none focus:ring-4 focus:ring-green-200 focus:ring-offset-0 ${
                      selectedRole === "farmer"
                        ? "bg-green-700 text-white shadow"
                        : "bg-white text-gray-800 border border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={selectedRole === "farmer" ? "white" : "#16A34A"}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                    <span className="text-base font-medium">Farmer</span>
                  </div>

                  {/* Shop Role Button */}
                  <div
                    role="radio"
                    tabIndex={0}
                    aria-checked={selectedRole === "shop"}
                    onKeyDown={(e) => onRoleKeyDown(e, "shop")}
                    onClick={() => handleRoleChange("shop")}
                    className={`w-full cursor-pointer rounded-lg py-3 px-4 flex items-center gap-3 transition-transform transform focus:outline-none focus:ring-4 focus:ring-amber-200 focus:ring-offset-0 ${
                      selectedRole === "shop"
                        ? "bg-amber-700 text-white shadow"
                        : "bg-white text-gray-800 border border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={selectedRole === "shop" ? "white" : "#D97706"}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span className="text-base font-medium">Shop</span>
                  </div>

                  {/* Mandi Role Button */}
                  <div
                    role="radio"
                    tabIndex={0}
                    aria-checked={selectedRole === "mandi"}
                    onKeyDown={(e) => onRoleKeyDown(e, "mandi")}
                    onClick={() => handleRoleChange("mandi")}
                    className={`w-full cursor-pointer rounded-lg py-3 px-4 flex items-center gap-3 transition-transform transform focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-0 ${
                      selectedRole === "mandi"
                        ? "bg-purple-700 text-white shadow"
                        : "bg-white text-gray-800 border border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={selectedRole === "mandi" ? "white" : "#7C3AED"}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="text-base font-medium">Mandi</span>
                  </div>
                </div>

                <input type="hidden" {...register("role")} />
                {errors.role && (
                  <p className="mt-2 text-sm text-red-600 font-medium text-center">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <p className="text-center text-gray-700 text-sm mt-4">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-green-800 hover:text-green-600">
                  Create one now
                </Link>
              </p>
            </div>

            {/* Right Column - Form */}
            <div className="md:w-2/3">
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      {...register("emailId")}
                      aria-invalid={errors.emailId ? "true" : "false"}
                      aria-describedby={errors.emailId ? "email-error" : "email-help"}
                      placeholder="you@example.com"
                      className={`w-full text-lg rounded-lg py-3 pl-12 pr-4 border transition-shadow focus:outline-none focus:ring-3 ${
                        errors.emailId
                          ? "border-red-400 ring-red-100"
                          : "border-gray-300 ring-green-100"
                      } bg-white text-gray-900`}
                    />
                    <div className="absolute left-3 top-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600" id="email-help">
                    We'll never share your email.
                  </p>
                  {errors.emailId && (
                    <p className="mt-2 text-sm text-red-600 font-medium" id="email-error">
                      {errors.emailId.message}
                    </p>
                  )}
                </div>

                {/* Password field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      {...register("password")}
                      aria-invalid={errors.password ? "true" : "false"}
                      aria-describedby={errors.password ? "password-error" : undefined}
                      placeholder="Enter your password"
                      className={`w-full text-lg rounded-lg py-3 pl-12 pr-4 border transition-shadow focus:outline-none focus:ring-3 ${
                        errors.password
                          ? "border-red-400 ring-red-100"
                          : "border-gray-300 ring-green-100"
                      } bg-white text-gray-900`}
                    />
                    <div className="absolute left-3 top-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 font-medium" id="password-error">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1 bg-green-800 hover:bg-green-900 disabled:bg-gray-400 text-white rounded-lg py-3 text-lg font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-green-200 transition-transform transform active:scale-98"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}