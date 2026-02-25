import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Admin Panel
        </h1>
        <p className="text-gray-500 text-center mt-2">
          Choose a section to manage
        </p>

        <div className="mt-8 grid gap-4">
          <button
            onClick={() => navigate("/admin/staff")}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Staff Page
          </button>

          <button
            onClick={() => navigate("/admin/students")}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Student List
          </button>

          <button
            onClick={() => navigate("/admin/teachers")}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Teacher List
          </button>
        </div>
      </div>
    </div>
  );
}