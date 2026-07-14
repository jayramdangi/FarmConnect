import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import {
  FaTractor,
  FaStore,
  FaHome,
  FaSun,
  FaMoon,
  FaSignOutAlt,
  FaBuilding, // for mandi
} from "react-icons/fa";
import { toggleTheme } from "../themeSlice";
import { logoutUser } from "../authSlice";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth) || {};
  const user = auth.user || {};
  const { role = "farmer", name = "User" } = user;

  const theme = useSelector((state) => state.theme.theme);

  const isActive = (path) => location.pathname.startsWith(path);

  /* ---------- STYLES ---------- */
  const navClass =
    theme === "dark"
      ? "sticky top-0 z-50 bg-gray-900 border-b border-gray-700"
      : "sticky top-0 z-50 bg-white border-b border-gray-200";

  const navBtnClass = (active) =>
    theme === "dark"
      ? active
        ? "flex items-center gap-2 px-3 py-2 rounded-md bg-gray-700 text-white"
        : "flex items-center gap-2 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800"
      : active
      ? "flex items-center gap-2 px-3 py-2 rounded-md bg-gray-200 text-gray-900"
      : "flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100";

  const squareBtnClass =
    theme === "dark"
      ? "w-10 h-10 flex items-center justify-center rounded-md bg-gray-800 hover:bg-gray-700 text-white"
      : "w-10 h-10 flex items-center justify-center rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700";

  /* ---------- HANDLERS ---------- */
  const handleThemeToggle = () => dispatch(toggleTheme());

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } finally {
      navigate("/login");
    }
  };

  // Determine which primary action button to show based on role
  const renderPrimaryNavButton = () => {
    const roleLower = role?.toLowerCase?.() || "farmer";

    if (roleLower === "shop") {
      return (
        <button
          onClick={() => navigate("/shop")}
          className={navBtnClass(isActive("/shop"))}
        >
          <FaStore /> Shop Management
        </button>
      );
    }

    if (roleLower === "mandi") {
      return (
        <button
          onClick={() => navigate("/mandi/dashboard")}
          className={navBtnClass(isActive("/mandi/dashboard"))}
        >
          <FaBuilding /> Mandi Dashboard
        </button>
      );
    }

    // default: farmer
    return (
      <button
        onClick={() => navigate("/farmer-query")}
        className={navBtnClass(isActive("/farmer-query"))}
      >
        <FaTractor /> Farmer Query
      </button>
    );
  };

  return (
    <nav className={navClass}>
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* ---------- LOGO ---------- */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold">
            AC
          </div>
          <span className="text-lg font-semibold">AgriConnect</span>
        </div>

        {/* ---------- DESKTOP ---------- */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => navigate("/")} className={navBtnClass(isActive("/"))}>
            <FaHome /> Home
          </button>

          {/* Role-specific button */}
          {renderPrimaryNavButton()}

          {/* ---------- THEME ---------- */}
          <button onClick={handleThemeToggle} className={squareBtnClass}>
            {theme === "dark" ? (
              <FaSun className="text-yellow-400" />
            ) : (
              <FaMoon />
            )}
          </button>

          {/* ---------- USER ---------- */}
          <div className="flex items-center gap-3 ml-4">
            <span className="text-sm opacity-80">{name}</span>
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold">
              {name?.charAt(0)}
            </div>
            <button onClick={handleLogout} className={squareBtnClass}>
              <FaSignOutAlt />
            </button>
          </div>
        </div>

        {/* ---------- MOBILE ---------- */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={() => navigate("/")} className={squareBtnClass}>
            <FaHome />
          </button>
          <button onClick={handleThemeToggle} className={squareBtnClass}>
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
}