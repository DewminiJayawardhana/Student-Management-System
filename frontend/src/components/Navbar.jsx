import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const onLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <div className="w-full bg-[#C82C41] text-white px-4 py-3 flex items-center justify-between">
      <div className="font-bold">Student Management System</div>

      <div className="flex gap-4 items-center">
        <Link to="/students" className="hover:underline">Students</Link>
        <Link to="/audit-logs" className="hover:underline">Audit Logs</Link>

        <div className="text-sm opacity-90">
          {user ? `${user.name} (${user.role})` : ""}
        </div>

        <button
          onClick={onLogout}
          className="bg-white text-[#A40033] px-3 py-1 rounded hover:bg-[#F5F5F5]"
        >
          Logout
        </button>
      </div>
    </div>
  );
}