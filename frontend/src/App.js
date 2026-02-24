import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Navbar from "./components/Navbar";
import ToastListener from "./components/ToastListener";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Students from "./pages/Students";
import AuditLogs from "./pages/AuditLogs";

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Navbar />
      <ToastListener />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={2500} />
        <Routes>
          <Route path="/" element={<Navigate to="/students" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <AppShell><Students /></AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute>
                <AppShell><AuditLogs /></AppShell>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}