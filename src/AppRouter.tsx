import {  Routes, Route, Navigate, Outlet } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./features/products/Products";
import { Movements } from "./features/movements/Movements";
import { Branches } from "./features/branches/Branches";
import { Brands } from "./features/brands/Brands";
import { Stocks } from "./features/stocks/Stocks";
import { UsersList } from "./pages/Users";
import { Settings } from "./features/settings/Settings";
import { Login } from "./features/login/Login";
import { AuthCallback } from "./pages/AuthCallback";
import { useAuth } from "./context/AuthContext";

// Protected Route component
function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/connect/auth0/callback" element={<AuthCallback />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="movements" element={<Movements />} />

          <Route path="branches" element={<Branches />} />
          <Route path="brands" element={<Brands />} />
          <Route path="stocks" element={<Stocks />} />
          <Route path="users" element={<UsersList />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRouter;
