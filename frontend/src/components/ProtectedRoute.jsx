import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowRoles }) {
  const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
  const teacherLoggedIn = localStorage.getItem("teacherLoggedIn") === "true";
  const studentLoggedIn = localStorage.getItem("studentLoggedIn") === "true";

  const role = localStorage.getItem("role"); // ADMIN / TEACHER / STUDENT

  const isLoggedIn = adminLoggedIn || teacherLoggedIn || studentLoggedIn;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const currentRole =
    role || (adminLoggedIn ? "ADMIN" : teacherLoggedIn ? "TEACHER" : studentLoggedIn ? "STUDENT" : null);

  if (allowRoles && currentRole && !allowRoles.includes(currentRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
