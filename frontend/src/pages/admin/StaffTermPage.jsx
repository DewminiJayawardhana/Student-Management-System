import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { api } from "../../api/axios";

export default function StaffTermPage() {
  const navigate = useNavigate();
  const { grade, term } = useParams();

  const [students, setStudents] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // A-I => A, B-II => B, C-III => C
  const classLetter = useMemo(() => {
    const t = String(term || "").trim();
    return t.split("-")[0].toUpperCase();
  }, [term]);

  const getStudentClass = (s) =>
    (s?.studentClass || s?.className || s?.class || s?.clazz || "")
      .toString()
      .toUpperCase();

  const fetchStudents = async () => {
    setLoading(true);
    setErr("");

    // ✅ Try these endpoints until one works (based on many SpringBoot projects)
    const endpoints = [
      `/api/students/grade/${grade}`,       // option 1
      `/api/students/by-grade/${grade}`,    // option 2
      `/api/students?grade=${grade}`,       // option 3
      `/api/students/${grade}`,             // option 4 (less common)
    ];

    let data = null;
    let lastError = null;

    for (const url of endpoints) {
      try {
        const res = await api.get(url);
        data = res.data;
        console.log("✅ StaffTermPage using endpoint:", url);
        break;
      } catch (e) {
        lastError = e;
      }
    }

    if (!data) {
      const status = lastError?.response?.status;
      const msg =
        lastError?.response?.data?.message ||
        lastError?.response?.data ||
        lastError?.message ||
        "Unknown error";

      setErr(
        `Cannot load students for Grade ${grade}. Your backend endpoint is different.
Tried: ${endpoints.join(" , ")}
Status: ${status || "?"}
Message: ${String(msg)}`
      );
      setStudents([]);
      setLoading(false);
      return;
    }

    const all = Array.isArray(data) ? data : [];
    const filtered = all.filter((s) => getStudentClass(s) === classLetter);

    setStudents(filtered);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, term]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
                Grade {grade} — {term}
              </h2>
              <p className="text-gray-600 mt-1">
                Showing Grade {grade} students from <b>Class {classLetter}</b>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(`/admin/staff/grade/${grade}`)}
              className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-100"
            >
              Back to Terms
            </button>

            <button
              type="button"
              onClick={fetchStudents}
              className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-100"
            >
              Refresh
            </button>
          </div>
        </div>

        {err && (
          <pre className="mt-3 text-sm text-red-600 whitespace-pre-wrap">
            {err}
          </pre>
        )}

        {/* VIEW ONLY TABLE */}
        <div className="mt-6 bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <p className="font-semibold text-gray-800">
              Students — Class {classLetter}
            </p>
            {loading && <p className="text-sm text-gray-500">Loading...</p>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Username</th>
                </tr>
              </thead>

              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan="2">
                      No students found for Grade {grade} Class {classLetter}.
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr
                      key={s.id || s._id || `${s.username}-${s.name}`}
                      className="border-t"
                    >
                      <td className="p-3">{s.name}</td>
                      <td className="p-3">{s.username}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}