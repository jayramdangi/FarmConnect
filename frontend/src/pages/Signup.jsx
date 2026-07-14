import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../authSlice";

// Schema validation for signup (includes role) – now uses emailId
const signupSchema = z.object({
  name: z.string().min(3, "Name should contain at least 3 characters"),
  emailId: z.string().email("Please enter a valid email address"),
  phoneNo: z
    .string()
    .min(10, "Phone number should be at least 10 digits")
    .regex(/^\d+$/, "Phone number should contain only digits"),
  location: z.string().min(2, "Location should contain at least 2 characters"),
  password: z.string().min(6, "Password should contain at least 6 characters"),
  role: z.enum(["farmer", "mandi"], {
    required_error: "Please select a role",
  }),
});

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [selectedRole, setSelectedRole] = useState("farmer");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "farmer",
    },
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setValue("role", role, { shouldValidate: true });
    // No default field values are changed here – user fills them manually.
  };

  const onRoleKeyDown = (e, role) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRoleChange(role);
    }
  };

  const submittedData = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div
              className={`inline-flex items-center justify-center p-4 rounded-full shadow-md ${
                selectedRole === "farmer" ? "bg-green-700" : "bg-purple-700"
              }`}
            >
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
                  d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zM21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900">
              Create {selectedRole === "farmer" ? "Farmer" : "Mandi"} Account
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-700">
              Join us today! Fill out the form to get started.
            </p>
          </div>

          {/* Display authentication error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-3 text-center">
              I am a
            </label>
            <div
              role="radiogroup"
              aria-label="Account type"
              className="flex justify-center gap-4 p-2 bg-gray-50 rounded-lg"
            >
              {/* Farmer Role Button */}
              <div
                role="radio"
                tabIndex={0}
                aria-checked={selectedRole === "farmer"}
                onKeyDown={(e) => onRoleKeyDown(e, "farmer")}
                onClick={() => handleRoleChange("farmer")}
                className={`cursor-pointer rounded-lg py-3 px-6 flex items-center gap-3 transition-transform transform focus:outline-none focus:ring-4 focus:ring-green-200 focus:ring-offset-0 ${
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

              {/* Mandi Role Button */}
              <div
                role="radio"
                tabIndex={0}
                aria-checked={selectedRole === "mandi"}
                onKeyDown={(e) => onRoleKeyDown(e, "mandi")}
                onClick={() => handleRoleChange("mandi")}
                className={`cursor-pointer rounded-lg py-3 px-6 flex items-center gap-3 transition-transform transform focus:outline-none focus:ring-4 focus:ring-purple-200 focus:ring-offset-0 ${
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

          {/* Form */}
          <form onSubmit={handleSubmit(submittedData)} noValidate>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column - Form Fields */}
              <div className="md:w-1/2 space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      type="text"
                      className={`w-full text-lg rounded-lg py-3 pl-12 pr-4 border transition-shadow focus:outline-none focus:ring-3 ${
                        errors.name ? "border-red-400 ring-red-100" : "border-gray-300 ring-green-100"
                      } bg-white text-gray-900`}
                      {...register("name")}
                      aria-invalid={errors.name ? "true" : "false"}
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.name.message}</p>
                  )}
                </div>

                {/* Email Field – now using emailId */}
                <div>
                  <label htmlFor="emailId" className="block text-sm font-semibold text-gray-800 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="emailId"
                      type="email"
                      className={`w-full text-lg rounded-lg py-3 pl-12 pr-4 border transition-shadow focus:outline-none focus:ring-3 ${
                        errors.emailId ? "border-red-400 ring-red-100" : "border-gray-300 ring-green-100"
                      } bg-white text-gray-900`}
                      {...register("emailId")}
                      aria-invalid={errors.emailId ? "true" : "false"}
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
                  {errors.emailId && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.emailId.message}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phoneNo" className="block text-sm font-semibold text-gray-800 mb-1">
                    Phone No
                  </label>
                  <div className="relative">
                    <input
                      id="phoneNo"
                      type="tel"
                      className={`w-full text-lg rounded-lg py-3 pl-12 pr-4 border transition-shadow focus:outline-none focus:ring-3 ${
                        errors.phoneNo ? "border-red-400 ring-red-100" : "border-gray-300 ring-green-100"
                      } bg-white text-gray-900`}
                      {...register("phoneNo")}
                      aria-invalid={errors.phoneNo ? "true" : "false"}
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.phoneNo && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.phoneNo.message}</p>
                  )}
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="md:w-1/2 space-y-4">
                {/* Location Field */}
                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-gray-800 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      id="location"
                      type="text"
                      className={`w-full text-lg rounded-lg py-3 pl-12 pr-4 border transition-shadow focus:outline-none focus:ring-3 ${
                        errors.location ? "border-red-400 ring-red-100" : "border-gray-300 ring-green-100"
                      } bg-white text-gray-900`}
                      {...register("location")}
                      aria-invalid={errors.location ? "true" : "false"}
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.location && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.location.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      className={`w-full text-lg rounded-lg py-3 pl-12 pr-4 border transition-shadow focus:outline-none focus:ring-3 ${
                        errors.password ? "border-red-400 ring-red-100" : "border-gray-300 ring-green-100"
                      } bg-white text-gray-900`}
                      {...register("password")}
                      aria-invalid={errors.password ? "true" : "false"}
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
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.password.message}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 ${
                selectedRole === "farmer"
                  ? "bg-green-700 hover:bg-green-800 focus:ring-green-200"
                  : "bg-purple-700 hover:bg-purple-800 focus:ring-purple-200"
              } disabled:bg-gray-400 text-white rounded-lg py-3 text-lg font-semibold shadow-md focus:outline-none focus:ring-4 transition-transform transform active:scale-98`}
            >
              {loading
                ? "Creating Account..."
                : `Create ${selectedRole === "farmer" ? "Farmer" : "Mandi"} Account`}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          <p className="text-center text-gray-700 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-green-700 hover:text-green-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;