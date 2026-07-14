import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import axiosClient from "../../utils/axiosClient";

export default function MandiDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme?.theme || "light");

  // Redirect if not authenticated or not mandi
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Mandi") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  // Theme-based classes
  const bgClass = theme === "dark"
    ? "min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
    : "min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200";

  const cardClass = theme === "dark"
    ? "bg-gray-800 border border-gray-700 shadow-xl"
    : "bg-white border border-gray-200 shadow-xl";

  const inputClass = theme === "dark"
    ? "w-full text-lg rounded-lg py-3 pl-12 pr-4 border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    : "w-full text-lg rounded-lg py-3 pl-12 pr-4 border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent";

  const labelClass = theme === "dark"
    ? "block text-sm font-semibold text-gray-300 mb-1"
    : "block text-sm font-semibold text-gray-800 mb-1";

  const buttonClass = theme === "dark"
    ? "w-full bg-purple-700 hover:bg-purple-800 disabled:bg-gray-600 text-white rounded-lg py-3 text-lg font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-purple-900 transition-transform transform active:scale-98"
    : "w-full bg-purple-700 hover:bg-purple-800 disabled:bg-gray-400 text-white rounded-lg py-3 text-lg font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-purple-200 transition-transform transform active:scale-98";

  const secondaryButtonClass = theme === "dark"
    ? "px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
    : "px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500";

  const successAlertClass = theme === "dark"
    ? "mb-4 p-3 bg-green-900/50 border border-green-700 text-green-300 rounded-lg text-center"
    : "mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center";

  const errorAlertClass = theme === "dark"
    ? "mb-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center"
    : "mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center";

  const listItemClass = theme === "dark"
    ? "px-4 py-3 flex items-center justify-between hover:bg-gray-700 border-gray-700"
    : "px-4 py-3 flex items-center justify-between hover:bg-gray-50 border-gray-200";

  // ---------- Shop Registration State ----------
  const [shopForm, setShopForm] = useState({
    name: "",
    ownerName: "",
    emailId: "",
    password: "",
  });
  const [shopLoading, setShopLoading] = useState(false);
  const [shopSuccess, setShopSuccess] = useState("");
  const [shopError, setShopError] = useState("");

  // ---------- Crop Management State ----------
  const [crops, setCrops] = useState([]);
  const [cropLoading, setCropLoading] = useState(false);
  const [cropError, setCropError] = useState("");

  // Crop form (for create/update)
  const [cropForm, setCropForm] = useState({ name: "" });
  const [editingCropId, setEditingCropId] = useState(null);
  const [cropFormLoading, setCropFormLoading] = useState(false);

  // Fetch crops on mount and after mutations
  const fetchCrops = async () => {
    setCropLoading(true);
    setCropError("");
    try {
      const res = await axiosClient.get("/crop/list");
      setCrops(res.data.crops || []);
    } catch (err) {
      setCropError(err.response?.data?.error || "Failed to load crops");
    } finally {
      setCropLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "Mandi") {
      fetchCrops();
    }
  }, [isAuthenticated, user]);

  // ---------- Shop Registration Handler ----------
  const handleShopSubmit = async (e) => {
    e.preventDefault();
    setShopLoading(true);
    setShopSuccess("");
    setShopError("");
    try {
      const res = await axiosClient.post("/mandi/auth/registerShop", shopForm);
      setShopSuccess(`Shop "${res.data.user.name}" registered successfully!`);
      setShopForm({ name: "", ownerName: "", emailId: "", password: "" });
    } catch (err) {
      setShopError(err.response?.data?.error || "Registration failed");
    } finally {
      setShopLoading(false);
    }
  };

  const handleShopChange = (e) => {
    setShopForm({ ...shopForm, [e.target.name]: e.target.value });
  };

  // ---------- Crop Handlers ----------
  const handleCropFormChange = (e) => {
    setCropForm({ name: e.target.value });
  };

  const handleCreateCrop = async (e) => {
    e.preventDefault();
    setCropFormLoading(true);
    setCropError("");
    try {
      await axiosClient.post("/crop/create", cropForm);
      setCropForm({ name: "" });
      fetchCrops();
    } catch (err) {
      setCropError(err.response?.data?.error || "Failed to create crop");
    } finally {
      setCropFormLoading(false);
    }
  };

  const handleUpdateCrop = async (e) => {
    e.preventDefault();
    if (!editingCropId) return;
    setCropFormLoading(true);
    setCropError("");
    try {
      await axiosClient.put(`/crop/update/${editingCropId}`, cropForm);
      setEditingCropId(null);
      setCropForm({ name: "" });
      fetchCrops();
    } catch (err) {
      setCropError(err.response?.data?.error || "Failed to update crop");
    } finally {
      setCropFormLoading(false);
    }
  };

  const handleDeleteCrop = async (cropId) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;
    try {
      await axiosClient.delete(`/crop/delete/${cropId}`);
      fetchCrops();
    } catch (err) {
      setCropError(err.response?.data?.error || "Failed to delete crop");
    }
  };

  const startEditCrop = (crop) => {
    setEditingCropId(crop.id);
    setCropForm({ name: crop.name });
  };

  const cancelEdit = () => {
    setEditingCropId(null);
    setCropForm({ name: "" });
    setCropError("");
  };

  if (!isAuthenticated || user?.role !== "Mandi") {
    return null;
  }

  return (
    <div className={bgClass}>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with icon */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="inline-flex items-center justify-center bg-purple-700 p-4 rounded-full shadow-md">
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h1 className={`mt-4 text-3xl md:text-4xl font-extrabold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Mandi Dashboard
            </h1>
            <p className={`mt-2 text-sm md:text-base ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Welcome back, {user?.name} – manage shops and crops here
            </p>
          </div>

          {/* Shop Registration Card */}
          <div className={`${cardClass} rounded-2xl overflow-hidden mb-8`}>
            <div className="p-8 md:p-10">
              <h2 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"} mb-6 flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Register New Shop
              </h2>

              {shopSuccess && <div className={successAlertClass}>{shopSuccess}</div>}
              {shopError && <div className={errorAlertClass}>{shopError}</div>}

              <form onSubmit={handleShopSubmit} className="space-y-6">
                {/* Shop Name */}
                <div>
                  <label htmlFor="shopName" className={labelClass}>
                    Shop Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="shopName"
                      name="name"
                      value={shopForm.name}
                      onChange={handleShopChange}
                      required
                      className={inputClass}
                      placeholder="Enter shop name"
                    />
                    <div className="absolute left-3 top-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Owner Name */}
                <div>
                  <label htmlFor="ownerName" className={labelClass}>
                    Owner Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="ownerName"
                      name="ownerName"
                      value={shopForm.ownerName}
                      onChange={handleShopChange}
                      required
                      className={inputClass}
                      placeholder="Enter owner name"
                    />
                    <div className="absolute left-3 top-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="shopEmail" className={labelClass}>
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="shopEmail"
                      name="emailId"
                      value={shopForm.emailId}
                      onChange={handleShopChange}
                      required
                      className={inputClass}
                      placeholder="shop@example.com"
                    />
                    <div className="absolute left-3 top-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="shopPassword" className={labelClass}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="shopPassword"
                      name="password"
                      value={shopForm.password}
                      onChange={handleShopChange}
                      required
                      minLength="6"
                      className={inputClass}
                      placeholder="Enter password (min. 6 characters)"
                    />
                    <div className="absolute left-3 top-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={shopLoading}
                  className={buttonClass}
                >
                  {shopLoading ? "Registering Shop..." : "Register Shop"}
                </button>
              </form>
            </div>
          </div>

          {/* Crop Management Card */}
          <div className={`${cardClass} rounded-2xl overflow-hidden`}>
            <div className="p-8 md:p-10">
              <h2 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"} mb-6 flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Manage Crops
              </h2>

              {cropError && <div className={errorAlertClass}>{cropError}</div>}

              {/* Crop Form */}
              <form onSubmit={editingCropId ? handleUpdateCrop : handleCreateCrop} className="mb-8">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cropName" className={labelClass}>
                      {editingCropId ? "Edit Crop Name" : "New Crop Name"}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cropName"
                        value={cropForm.name}
                        onChange={handleCropFormChange}
                        required
                        className={inputClass}
                        placeholder={editingCropId ? "Update crop name" : "Enter crop name"}
                      />
                      <div className="absolute left-3 top-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={cropFormLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg py-3 text-lg font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-green-200 transition-transform transform active:scale-98"
                    >
                      {cropFormLoading ? "Saving..." : editingCropId ? "Update Crop" : "Create Crop"}
                    </button>
                    
                    {editingCropId && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className={secondaryButtonClass}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </form>

              {/* Crop List */}
              <div>
                <h3 className={`text-lg font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-900"} mb-4`}>
                  Existing Crops
                </h3>
                
                {cropLoading && crops.length === 0 ? (
                  <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Loading crops...</p>
                ) : crops.length === 0 ? (
                  <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>No crops found. Create one above.</p>
                ) : (
                  <ul className={`divide-y ${theme === "dark" ? "divide-gray-700 border-gray-700" : "divide-gray-200 border-gray-200"} border rounded-lg`}>
                    {crops.map((crop) => (
                      <li key={crop.id} className={listItemClass}>
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-900"}>
                          {crop.name}
                        </span>
                        <div className="flex gap-3">
                          <button
                            onClick={() => startEditCrop(crop)}
                            className={`text-sm font-medium ${
                              theme === "dark" 
                                ? "text-blue-400 hover:text-blue-300" 
                                : "text-blue-600 hover:text-blue-800"
                            }`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCrop(crop.id)}
                            className={`text-sm font-medium ${
                              theme === "dark" 
                                ? "text-red-400 hover:text-red-300" 
                                : "text-red-600 hover:text-red-800"
                            }`}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}