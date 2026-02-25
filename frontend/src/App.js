import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminPanel from "./pages/admin/AdminPanel";
import StaffPage from "./pages/admin/StaffPage";
import StaffGradePage from "./pages/admin/StaffGradePage";
import StaffTermPage from "./pages/admin/StaffTermPage";
import StudentListPage from "./pages/admin/StudentListPage";
import TeacherListPage from "./pages/admin/TeacherListPage";
import ProtectedRoute from "./components/ProtectedRoute";
import GradeStudentsPage from "./pages/admin/GradeStudentsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* ✅ Staff routes (NEW) */}
        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute>
              <StaffPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/staff/grade/:grade"
          element={
            <ProtectedRoute>
              <StaffGradePage />
            </ProtectedRoute>
          }
        />
       

        {/* Students */}
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute>
              <StudentListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students/grade/:grade"
          element={
            <ProtectedRoute>
              <GradeStudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/staff/grade/:grade/:term"
  element={
    <ProtectedRoute>
      <StaffTermPage />
    </ProtectedRoute>
  }
/>

        {/* Teachers */}
        <Route
          path="/admin/teachers"
          element={
            <ProtectedRoute>
              <TeacherListPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}