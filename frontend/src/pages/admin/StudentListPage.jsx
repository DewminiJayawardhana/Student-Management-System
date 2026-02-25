import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import { FiArrowLeft } from "react-icons/fi";

export default function StudentListPage() {
  const navigate = useNavigate();
  const grades = Array.from({ length: 13 }, (_, i) => i + 1);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handlePromote = async () => {
    try {
      setLoading(true);
      setMsg("");
      await api.post("/api/students/promote");
      setMsg("✅ Students promoted successfully (Grade 13 removed).");
    } catch (e) {
      setMsg("❌ Promote failed. Check backend running on 8081.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start md:items-center justify-between gap-3 flex-wrap">
          <div className="flex flex-col gap-3">
            {/* ✅ Back to Admin Panel */}
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-xl bg-white border hover:bg-gray-100"
              title="Back to Admin Panel"
            >
              <FiArrowLeft size={18} />
              Back to Admin Panel
            </button>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">Student List</h2>
              <p className="text-gray-600 mt-1">
                Select a grade to manage students
              </p>
            </div>
          </div>

          <button
            onClick={handlePromote}
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Promoting..." : "UpToGrade"}
          </button>
        </div>

        {msg && <p className="mt-3 text-sm">{msg}</p>}

        {/* Grades */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {grades.map((g) => (
            <button
              key={g}
              onClick={() => navigate(`/admin/students/grade/${g}`)}
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