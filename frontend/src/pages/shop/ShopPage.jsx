import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaEdit,
  FaChevronDown,
  FaChevronUp,
  FaSave,
  FaTimes,
  FaSearch,
  FaCalendarAlt
} from "react-icons/fa";

import {
  getShopRecordsByDate,
  createShopRecord,
  deleteShopRecord,
  updateShopRecord,
  getCropList,
  searchFarmers
} from "../../api/shopRecords.api";

export default function ShopPage() {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.theme) || "dark";

  // Date state – default to today
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  // Records state
  const [records, setRecords] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [crops, setCrops] = useState([]);

  // Top form states
  const [farmerSearch, setFarmerSearch] = useState("");
  const [farmerResults, setFarmerResults] = useState([]);
  const [showFarmerResults, setShowFarmerResults] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null); // { id, name }

  // New record form
  const [form, setForm] = useState({
    cropId: "",
    quantity: "",
    price: ""
  });

  // Inline editing states
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({
    farmerId: "",
    cropId: "",
    quantity: "",
    price: "",
    farmerName: ""
  });
  const [editingFarmerSearch, setEditingFarmerSearch] = useState("");
  const [editingFarmerResults, setEditingFarmerResults] = useState([]);
  const [showEditingFarmerResults, setShowEditingFarmerResults] = useState(false);
  const [editingSelectedFarmer, setEditingSelectedFarmer] = useState(null); // { id, name }

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Refs to handle outside clicks for result lists
  const topSearchRef = useRef(null);
  const editingSearchRefs = useRef({});

  // Styles
  const bgClass =
    theme === "dark"
      ? "min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-gray-100"
      : "min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 text-gray-800";

  const cardClass =
    theme === "dark"
      ? "p-4 rounded-xl border border-gray-700 bg-gray-900/50"
      : "p-4 rounded-xl border border-gray-200 bg-white";

  const inputClass =
    theme === "dark"
      ? "w-full px-3 py-2 rounded border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-emerald-500"
      : "w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500";

  const selectClass = inputClass;
  const buttonClass =
    "bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-4 py-2 rounded transition";

  const resultsListClass =
    "absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg max-h-60 overflow-y-auto mt-1";

  // Fetch records for the selected date
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await getShopRecordsByDate(selectedDate);
      setRecords(res.data.records || []);
    } catch (err) {
      console.error("Fetch records error:", err);
      setError(err.response?.data?.error || "Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  const fetchCrops = async () => {
    try {
      const res = await getCropList();
      setCrops(res.data.crops || []);
    } catch (err) {
      console.error("Fetch crops error:", err);
    }
  };

  // Load crops once on mount
  useEffect(() => {
    fetchCrops();
  }, []);

  // Fetch records whenever selectedDate changes
  useEffect(() => {
    fetchRecords();
  }, [selectedDate]);

  // Click outside handler for search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (topSearchRef.current && !topSearchRef.current.contains(event.target)) {
        setShowFarmerResults(false);
      }
      Object.keys(editingSearchRefs.current).forEach((key) => {
        if (
          editingSearchRefs.current[key] &&
          !editingSearchRefs.current[key].contains(event.target)
        ) {
          setShowEditingFarmerResults(false);
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Top form search handler
  const handleSearchFarmers = async () => {
    if (!farmerSearch.trim()) {
      setError("Please enter a farmer name to search");
      return;
    }
    try {
      const res = await searchFarmers(farmerSearch);
      const farmers = res.data.farmers || [];
      setFarmerResults(farmers);
      setShowFarmerResults(true);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search farmers");
    }
  };

  const selectFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setFarmerSearch(farmer.name);
    setShowFarmerResults(false);
  };

  // Inline search handler
  const handleEditingSearchFarmers = async (recordId) => {
    if (!editingFarmerSearch.trim()) {
      setError("Please enter a farmer name to search");
      return;
    }
    try {
      const res = await searchFarmers(editingFarmerSearch);
      const farmers = res.data.farmers || [];
      setEditingFarmerResults(farmers);
      setShowEditingFarmerResults(true);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search farmers");
    }
  };

  const selectEditingFarmer = (farmer) => {
    setEditingSelectedFarmer(farmer);
    setEditingFarmerSearch(farmer.name);
    setEditingForm({ ...editingForm, farmerId: farmer.id, farmerName: farmer.name });
    setShowEditingFarmerResults(false);
  };

  // Save new record
  const handleSave = async () => {
    setError("");
    setSuccess("");
    if (!selectedFarmer) {
      setError("Please select a farmer");
      return;
    }
    if (!form.cropId || !form.quantity) {
      setError("Crop and Quantity are required");
      return;
    }
    try {
      setSaving(true);
      await createShopRecord({
        farmerId: selectedFarmer.id,
        cropId: form.cropId,
        quantity: form.quantity,
        price: form.price,
        date: selectedDate
      });
      setSuccess("Record created successfully");
      setSelectedFarmer(null);
      setFarmerSearch("");
      setForm({ cropId: "", quantity: "", price: "" });
      setFarmerResults([]);
      fetchRecords();
    } catch (err) {
      console.error("Create error:", err);
      setError(err.response?.data?.error || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  // Start editing
  const handleStartEdit = (record) => {
    setEditingId(record.id);
    setEditingForm({
      farmerId: record.farmerId,
      cropId: record.cropId,
      quantity: record.quantity,
      price: record.rate,
      farmerName: record.Farmer?.name || ""
    });
    setEditingFarmerSearch(record.Farmer?.name || "");
    setEditingSelectedFarmer(
      record.Farmer ? { id: record.farmerId, name: record.Farmer.name } : null
    );
    setShowEditingFarmerResults(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingForm({ farmerId: "", cropId: "", quantity: "", price: "", farmerName: "" });
    setEditingFarmerSearch("");
    setEditingSelectedFarmer(null);
    setShowEditingFarmerResults(false);
  };

  // Save edit
  const handleSaveEdit = async () => {
    setError("");
    setSuccess("");
    if (!editingSelectedFarmer) {
      setError("Please select a farmer");
      return;
    }
    if (!editingForm.cropId || !editingForm.quantity) {
      setError("Crop and Quantity are required");
      return;
    }
    try {
      setSaving(true);
      await updateShopRecord(editingId, {
        farmerId: editingSelectedFarmer.id,
        cropId: editingForm.cropId,
        quantity: editingForm.quantity,
        price: editingForm.price,
        date: selectedDate
      });
      setSuccess("Record updated successfully");
      setEditingId(null);
      setEditingForm({ farmerId: "", cropId: "", quantity: "", price: "", farmerName: "" });
      setEditingFarmerSearch("");
      setEditingSelectedFarmer(null);
      setShowEditingFarmerResults(false);
      fetchRecords();
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await deleteShopRecord(id);
      fetchRecords();
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className={bgClass}>
      <div className="h-16" />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header with back button and date selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-emerald-500">
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold">Shop Records</h1>
          </div>

          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-emerald-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-500/20 text-green-400 rounded">{success}</div>}

        {/* Add New Record Form */}
        <div className={`${cardClass} mb-6`}>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <FaPlus /> Add New Record
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* Farmer Search with Button */}
            <div className="relative col-span-2" ref={topSearchRef}>
              <label className="block text-sm mb-1">Farmer</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={farmerSearch}
                  onChange={(e) => setFarmerSearch(e.target.value)}
                  placeholder="Enter farmer name"
                  className={inputClass}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={handleSearchFarmers}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center gap-1"
                >
                  <FaSearch /> Search
                </button>
              </div>
              {showFarmerResults && farmerResults.length > 0 && (
                <div className={resultsListClass}>
                  {farmerResults.map((farmer) => (
                    <div
                      key={farmer.id}
                      onClick={() => selectFarmer(farmer)}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
                    >
                      {farmer.name}
                    </div>
                  ))}
                </div>
              )}
              {selectedFarmer && (
                <div className="mt-1 text-sm text-emerald-400">
                  Selected: {selectedFarmer.name}
                </div>
              )}
            </div>

            {/* Crop Selection */}
            <div>
              <label className="block text-sm mb-1">Crop</label>
              <select
                value={form.cropId}
                onChange={(e) => setForm({ ...form, cropId: e.target.value })}
                className={selectClass}
              >
                <option value="">Select Crop</option>
                {crops.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm mb-1">Quantity</label>
              <input
                type="number"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className={inputClass}
              />
            </div>

            {/* Rate */}
            <div>
              <label className="block text-sm mb-1">Rate (₹)</label>
              <input
                type="number"
                placeholder="Rate"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <button
            disabled={saving}
            onClick={handleSave}
            className={`${buttonClass} mt-4`}
          >
            {saving ? "Saving..." : "Save New Record"}
          </button>
        </div>

        {/* Records Table */}
        <div className={cardClass}>
          {loading ? (
            <p>Loading...</p>
          ) : records.length === 0 ? (
            <p className="text-center py-4">No records found for {selectedDate}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="text-left py-3 px-4 w-12">▼</th>
                    <th className="text-left py-3 px-4">Farmer</th>
                    <th className="text-left py-3 px-4">Crop</th>
                    <th className="text-left py-3 px-4 text-right w-24">Qty</th>
                    <th className="text-left py-3 px-4 text-right w-24">Rate</th>
                    <th className="text-left py-3 px-4 w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <React.Fragment key={record.id}>
                      <tr className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-500/10">
                        {/* Expand/collapse */}
                        <td
                          className="py-3 px-4 text-center cursor-pointer"
                          onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                        >
                          {expandedId === record.id ? <FaChevronUp /> : <FaChevronDown />}
                        </td>

                        {/* Farmer field with inline edit */}
                        <td className="py-3 px-4 relative">
                          {editingId === record.id ? (
                            <div
                              className="relative"
                              ref={(el) => (editingSearchRefs.current[record.id] = el)}
                            >
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={editingFarmerSearch}
                                  onChange={(e) => setEditingFarmerSearch(e.target.value)}
                                  className={`${inputClass} pr-8`}
                                  placeholder="Search farmer..."
                                  autoComplete="off"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleEditingSearchFarmers(record.id)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded flex items-center gap-1 text-sm"
                                >
                                  <FaSearch />
                                </button>
                              </div>
                              {showEditingFarmerResults &&
                                editingFarmerResults.length > 0 && (
                                  <div className={resultsListClass}>
                                    {editingFarmerResults.map((farmer) => (
                                      <div
                                        key={farmer.id}
                                        onClick={() => selectEditingFarmer(farmer)}
                                        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
                                      >
                                        {farmer.name}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              {editingSelectedFarmer && (
                                <div className="mt-1 text-xs text-emerald-400">
                                  Selected: {editingSelectedFarmer.name}
                                </div>
                              )}
                            </div>
                          ) : (
                            record.Farmer?.name
                          )}
                        </td>

                        {/* Crop field */}
                        <td className="py-3 px-4">
                          {editingId === record.id ? (
                            <select
                              value={editingForm.cropId}
                              onChange={(e) => setEditingForm({ ...editingForm, cropId: e.target.value })}
                              className={selectClass}
                            >
                              <option value="">Select Crop</option>
                              {crops.map((crop) => (
                                <option key={crop.id} value={crop.id}>
                                  {crop.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            record.Crop?.name
                          )}
                        </td>

                        {/* Quantity field */}
                        <td className="py-3 px-4 text-right">
                          {editingId === record.id ? (
                            <input
                              type="number"
                              value={editingForm.quantity}
                              onChange={(e) => setEditingForm({ ...editingForm, quantity: e.target.value })}
                              className={`${inputClass} text-right`}
                            />
                          ) : (
                            record.quantity
                          )}
                        </td>

                        {/* Rate field */}
                        <td className="py-3 px-4 text-right">
                          {editingId === record.id ? (
                            <input
                              type="number"
                              value={editingForm.price}
                              onChange={(e) => setEditingForm({ ...editingForm, price: e.target.value })}
                              className={`${inputClass} text-right`}
                            />
                          ) : (
                            record.rate
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4">
                          {editingId === record.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={handleSaveEdit}
                                disabled={saving}
                                className="text-green-500 hover:text-green-400 disabled:opacity-50"
                                title="Save"
                              >
                                <FaSave />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={saving}
                                className="text-red-500 hover:text-red-400 disabled:opacity-50"
                                title="Cancel"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleStartEdit(record)}
                                className="text-emerald-500 hover:text-emerald-400"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(record.id)}
                                className="text-red-500 hover:text-red-400"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Expanded details row */}
                      {expandedId === record.id && (
                        <tr className="bg-black/20 dark:bg-white/5 text-xs">
                          <td colSpan="6" className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <b>Record ID:</b> {record.id}
                              </div>
                              <div>
                                <b>Date:</b> {record.date}
                              </div>
                              <div>
                                <b>Farmer ID:</b> {record.farmerId}
                              </div>
                              <div>
                                <b>Crop ID:</b> {record.cropId}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}