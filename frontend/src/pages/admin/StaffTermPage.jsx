import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiTrash2 } from "react-icons/fi";
import { api } from "../../api/axios";
import ChangeHistoryModal from "../../components/ChangeHistoryModal";

export default function StaffTermPage() {
  const navigate = useNavigate();
  const { grade, term } = useParams();

  const role = localStorage.getItem("role") || "";
  const teacherUsername = localStorage.getItem("teacherUsername") || "";
  const updatedBy = role === "ADMIN" ? "ADMIN" : teacherUsername;

  const isAdmin = role === "ADMIN";

  const [students, setStudents] = useState([]);
  const [columns, setColumns] = useState([]); // [{key,name}]
  const [marks, setMarks] = useState({});     // marks[studentId][colKey] = value

  const [historyOpen, setHistoryOpen] = useState(false);

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingCell, setSavingCell] = useState(""); // `${studentId}:${colKey}`

  // A-I => A, B-II => B, C-III => C
  const classLetter = useMemo(() => {
    const t = String(term || "").trim();
    return (t.split("-")[0] || "").toUpperCase();
  }, [term]);

  const entityKey = `G${grade}-${classLetter}-${term}`;

  const loadStudents = async () => {
    const res = await api.get(`/api/students?grade=${grade}`);
    const all = res.data || [];
    const filtered = all.filter(
      (s) => String(s?.classRoom || "").toUpperCase() === classLetter
    );
    setStudents(filtered);
  };

  const loadSheet = async () => {
    const res = await api.get(
      `/api/mark-sheets?grade=${grade}&classRoom=${classLetter}&term=${term}`
    );
    setColumns(res.data?.columns || []);
    setMarks(res.data?.marks || {});
  };

  const refreshAll = async () => {
    try {
      setLoading(true);
      setErr("");
      await loadStudents();
      await loadSheet();
    } catch {
      setErr("Backend not reachable. Start Spring Boot on port 8081.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, term]);

  const addColumn = async () => {
    if (isAdmin) {
      setErr("Admin cannot add/update subjects or marks.");
      return;
    }

    const name = window.prompt("Enter column name (ex: Maths / English / Quiz 1):");
    if (!name || !name.trim()) return;

    try {
      setErr("");
      await api.post(
        `/api/mark-sheets/columns?grade=${grade}&classRoom=${classLetter}&term=${term}`,
        { name: name.trim(), updatedBy }
      );
      await loadSheet();
    } catch (e) {
      const m = e?.response?.data?.message || e?.response?.data || "Add column failed";
      setErr(String(m));
    }
  };

  const removeColumn = async (colKey) => {
    if (isAdmin) {
      setErr("Admin cannot add/update subjects or marks.");
      return;
    }

    const ok = window.confirm("Remove this column for everyone?");
    if (!ok) return;

    try {
      setErr("");
      await api.delete(
        `/api/mark-sheets/columns/${colKey}?grade=${grade}&classRoom=${classLetter}&term=${term}&updatedBy=${updatedBy}`
      );
      await loadSheet();
    } catch (e) {
      const m = e?.response?.data?.message || e?.response?.data || "Remove failed";
      setErr(String(m));
    }
  };

  const getCellValue = (studentId, colKey) => {
    return marks?.[studentId]?.[colKey] ?? "";
  };

  const setCellValue = (studentId, colKey, value) => {
    setMarks((prev) => {
      const copy = { ...prev };
      const row = { ...(copy[studentId] || {}) };
      row[colKey] = value;
      copy[studentId] = row;
      return copy;
    });
  };

  const saveCell = async (studentId, colKey) => {
    if (isAdmin) {
      setErr("Admin cannot add/update subjects or marks.");
      return;
    }

    const v = getCellValue(studentId, colKey);

    if (v === "" || v === null || v === undefined) {
      setErr("Marks required (0-100).");
      return;
    }

    const n = Number(v);
    if (Number.isNaN(n) || n < 0 || n > 100) {
      setErr("Marks must be 0-100.");
      return;
    }

    try {
      setErr("");
      setSavingCell(`${studentId}:${colKey}`);

      await api.put(
        `/api/mark-sheets/mark?grade=${grade}&classRoom=${classLetter}&term=${term}`,
        { studentId, columnKey: colKey, value: n, updatedBy }
      );

      await loadSheet();
    } catch (e) {
      const m = e?.response?.data?.message || e?.response?.data || "Save failed";
      setErr(String(m));
    } finally {
      setSavingCell("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start md:items-center justify-between gap-3 flex-wrap">
          <div className="flex flex-col gap-2">
            {/* Admin can see history */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setHistoryOpen(true)}
                className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-100"
              >
                Change History
              </button>
            )}

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
                Class <b>{classLetter}</b> | Shared mark sheet
              </p>

              {isAdmin && (
                <p className="text-xs text-gray-500 mt-1">
                  Admin mode: view-only (cannot change subjects/marks)
                </p>
              )}
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
              onClick={refreshAll}
              className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-100"
            >
              Refresh
            </button>

            {/* Teachers only */}
            {!isAdmin && (
              <button
                type="button"
                onClick={addColumn}
                className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 inline-flex items-center gap-2"
                title="Add a new column"
              >
                <FiPlus /> Add Column
              </button>
            )}
          </div>
        </div>

        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

        {/* Table */}
        <div className="mt-6 bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <p className="font-semibold text-gray-800">Students + Marks</p>
            {loading && <p className="text-sm text-gray-500">Loading...</p>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 min-w-[220px]">Student Name</th>
                  <th className="p-3 min-w-[160px]">Username</th>
                  <th className="p-3 min-w-[80px]">Class</th>

                  {columns.map((c) => (
                    <th key={c.key} className="p-3 min-w-[170px]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{c.name}</span>

                        {/* Teachers only: remove column */}
                        {!isAdmin && (
                          <button
                            type="button"
                            onClick={() => removeColumn(c.key)}
                            className="text-gray-600 hover:text-red-600"
                            title="Remove column"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan={3 + columns.length}>
                      No students found.
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="p-3">{s.name}</td>
                      <td className="p-3">{s.username}</td>
                      <td className="p-3">{s.classRoom}</td>

                      {columns.map((c) => {
                        const cellKey = `${s.id}:${c.key}`;
                        const val = getCellValue(s.id, c.key);

                        return (
                          <td key={c.key} className="p-3">
                            <div className="flex items-center gap-2">
                              <input
                                value={val}
                                onChange={(e) => setCellValue(s.id, c.key, e.target.value)}
                                className="w-24 px-3 py-2 border rounded-xl disabled:bg-gray-100"
                                placeholder="0-100"
                                type="number"
                                min="0"
                                max="100"
                                disabled={isAdmin} // ✅ admin cannot edit
                              />

                              {/* Teachers only */}
                              {!isAdmin && (
                                <button
                                  type="button"
                                  onClick={() => saveCell(s.id, c.key)}
                                  disabled={savingCell === cellKey}
                                  className="px-3 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60"
                                >
                                  {savingCell === cellKey ? "..." : "Save"}
                                </button>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Change History Modal */}
        <ChangeHistoryModal
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
          entityType="MARK_SHEET"
          entityKey={entityKey}
        />
      </div>
    </div>
  );
}