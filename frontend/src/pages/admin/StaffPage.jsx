import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function StaffPage() {
  const navigate = useNavigate();
  const grades = Array.from({ length: 13 }, (_, i) => i + 1);

  const [msg, setMsg] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start md:items-center justify-between gap-3 flex-wrap">
          <div className="flex flex-col gap-2">
            {/* 🔙 Icon-only Back to Admin */}
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="w-fit text-red-600 hover:text-red-800"
              title="Back to Admin Panel"
            >
              <FiArrowLeft size={22} />
            </button>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">Staff Page</h2>
              <p className="text-gray-600 mt-1">
                Select a grade to manage staff
              </p>
            </div>
          </div>

          {/* Optional right-side button (remove if not needed) */}
          <button
            type="button"
            onClick={() => setMsg("✅ Ready to manage staff by grade")}
            className="px-5 py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90"
          >
            Action
          </button>
        </div>

        {msg && <p className="mt-3 text-sm">{msg}</p>}

        {/* Grade buttons */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {grades.map((g) => (
            <button
              key={g}
              onClick={() => navigate(`/admin/staff/grade/${g}`)}
              className="py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Grade {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}