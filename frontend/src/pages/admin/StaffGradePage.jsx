import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function StaffGradePage() {
  const navigate = useNavigate();
  const { grade } = useParams();

  const terms = [
    "A-I", "A-II", "A-III",
    "B-I", "B-II", "B-III",
    "C-I", "C-II", "C-III",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start md:items-center justify-between gap-3 flex-wrap">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="w-fit text-red-600 hover:text-red-800"
              title="Back to Admin Panel"
            >
              <FiArrowLeft size={22} />
            </button>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Grade {grade} — Terms
              </h2>
              <p className="text-gray-600 mt-1">
                Select A/B/C and Term (A-I means Class A, Term 1)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/staff")}
            className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-100"
          >
            Back to Grades
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {terms.map((t) => (
            <button
              key={t}
              onClick={() => navigate(`/admin/staff/grade/${grade}/${t}`)}
              className="py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}