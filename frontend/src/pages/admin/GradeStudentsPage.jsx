import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/axios";

const emptyForm = (grade) => ({
  name: "",
  username: "",
  grade: Number(grade),
  classRoom: "A",
});

export default function GradeStudentsPage() {
  const { grade } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState(emptyForm(grade));
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get(`/api/students?grade=${grade}`);
      setStudents(res.data || []);
    } catch (e) {
      setErr("Backend not reachable. Start Spring Boot on port 8081.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm(emptyForm(grade));
    setEditingId(null);
    fetchStudents();
    // eslint-disable-next-line
  }, [grade]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setErr("");

      const payload = {
        name: form.name.trim(),
        username: form.username.trim(),
        grade: Number(grade),
        classRoom: form.classRoom,
      };

      if (!payload.name || !payload.username) {
        setErr("Name and Username are required.");
        return;
      }

      if (editingId) {
        await api.put(`/api/students/${editingId}`, payload);
      } else {
        await api.post("/api/students", payload);
      }

      setForm(emptyForm(grade));
      setEditingId(null);
      fetchStudents();
    } catch (e) {
      // Mongo unique index / duplicate username
      const message = e?.response?.data?.message || "";
      if (String(message).toLowerCase().includes("username")) {
        setErr("Username already exists. Try another one.");
      } else {
        setErr("Save failed. Check backend console for errors.");
      }
    }
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setForm({
      name: s.name || "",
      username: s.username || "",
      grade: Number(grade),
      classRoom: s.classRoom || "A",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm(grade));
  };

  const removeStudent = async (id) => {
    const ok = window.confirm("Delete this student?");
    if (!ok) return;

    try {
      await api.delete(`/api/students/${id}`);
      fetchStudents();
    } catch (e) {
      setErr("Delete failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/admin/students")}
          className="mb-4 px-4 py-2 rounded-xl border bg-white hover:bg-gray-100"
        >
          ⬅ Back
        </button>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Grade {grade} Students</h2>
          <button
            onClick={fetchStudents}
            className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-100"
          >
            Refresh
          </button>
        </div>

        {/* Add / Update Form */}
        <div className="mt-5 bg-white rounded-2xl shadow p-5">
          <h3 className="font-semibold text-gray-800">
            {editingId ? "Update Student" : "Add Student"}
          </h3>

          {err && <p className="text-red-600 text-sm mt-2">{err}</p>}

          <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Student Name"
              className="px-4 py-2 border rounded-xl"
            />

            <input
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              placeholder="Username"
              className="px-4 py-2 border rounded-xl"
            />

            <select
              value={form.classRoom}
              onChange={(e) => setForm((p) => ({ ...p, classRoom: e.target.value }))}
              className="px-4 py-2 border rounded-xl"
            >
              <option value="A">Class A</option>
              <option value="B">Class B</option>
              <option value="C">Class C</option>
            </select>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
              >
                {editingId ? "Update" : "Add"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="mt-6 bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <p className="font-semibold text-gray-800">Students</p>
            {loading && <p className="text-sm text-gray-500">Loading...</p>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan="4">
                      No students yet.
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="p-3">{s.name}</td>
                      <td className="p-3">{s.username}</td>
                      <td className="p-3">{s.classRoom}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(s)}
                            className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeStudent(s.id)}
                            className="px-3 py-1 rounded-lg bg-black text-white hover:opacity-90"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
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