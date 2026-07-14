import React, { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./authSlice";

/* Layout */
import Navbar from "./pages/Navbar";

/* Public pages */
import Login from "./pages/Login";
import Signup from "./pages/Signup";

/* Common pages */
import HomePage from "./pages/Homepage";
import FarmerQuery from "./pages/FarmerQuery";

/* SHOP PAGES - now only one */
import ShopPage from "./pages/shop/ShopPage"; // new combined page

/* MANDI PAGES */
import MandiDashboard from "./pages/mandi/MandiDashboard";

/* ---------- AUTH GUARD ---------- */
function RequireAuth({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children ? children : <Outlet />;
}

/* ---------- LAYOUT ---------- */
function AppLayout() {
  return (
    <>
      <Navbar />
      <div className="App">
        <Outlet />
      </div>
    </>
  );
}

/* ---------- APP ---------- */
function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      {/* ---------- PUBLIC ---------- */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />}
      />

      {/* ---------- PROTECTED ---------- */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/farmer-query" element={<FarmerQuery />} />

        {/* SHOP - single combined page */}
        <Route path="/shop" element={<ShopPage />} />

        {/* MANDI */}
        <Route path="/mandi/dashboard" element={<MandiDashboard />} />
      </Route>

      {/* ---------- FALLBACK ---------- */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;