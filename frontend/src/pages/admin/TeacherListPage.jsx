import React, { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const empty = {
  name: "",
  subjects: "",
  username: "",
  email: "",
  telNumber: "",
};

export default function TeacherListPage() {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get("/api/teachers");
      setTeachers(res.data || []);
    } catch (e) {
      setErr("Backend not reachable. Start Spring Boot on port 8081.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    const payload = {
      name: form.name.trim(),
      subjects: form.subjects.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      telNumber: form.telNumber.trim(),
    };

    if (
      !payload.name ||
      !payload.subjects ||
      !payload.username ||
      !payload.email ||
      !payload.telNumber
    ) {
      setErr("All fields are required.");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/api/teachers/${editingId}`, payload);
      } else {
        await api.post("/api/teachers", payload);
      }
      setForm(empty);
      setEditingId(null);
      fetchTeachers();
    } catch (e2) {
      const msg = e2?.response?.data?.message || "";
      if (String(msg).toLowerCase().includes("username"))
        setErr("Username already exists.");
      else if (String(msg).toLowerCase().includes("email"))
        setErr("Email already exists.");
      else setErr("Save failed. Check backend console.");
    }
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({
      name: t.name || "",
      subjects: t.subjects || "",
      username: t.username || "",
      email: t.email || "",
      telNumber: t.telNumber || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(empty);
  };

  const remove = async (id) => {
    const ok = window.confirm("Delete this teacher?");
    if (!ok) return;

    try {
      await api.delete(`/api/teachers/${id}`);
      fetchTeachers();
    } catch {
      setErr("Delete failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start md:items-center justify-between flex-wrap gap-3">
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
              <h2 className="text-2xl font-bold text-gray-800">Teacher List</h2>
              <p className="text-gray-600 mt-1">
                Admin can add / update / delete teachers
              </p>
            </div>
          </div>

          <button
            onClick={fetchTeachers}
            className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-100"
          >
            Refresh
          </button>
        </div>

        {/* Form */}
        <div className="mt-5 bg-white rounded-2xl shadow p-5">
          <h3 className="font-semibold text-gray-800">
            {editingId ? "Update Teacher" : "Add Teacher"}
          </h3>

          {err && <p className="text-red-600 text-sm mt-2">{err}</p>}

          <form
            onSubmit={submit}
            className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3"
          >
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Teacher Name"
              className="px-4 py-2 border rounded-xl"
            />
            <input
              value={form.subjects}
              onChange={(e) =>
                setForm((p) => ({ ...p, subjects: e.target.value }))
              }
              placeholder="Subjects (ex: Math, Science)"
              className="px-4 py-2 border rounded-xl"
            />
            <input
              value={form.username}
              onChange={(e) =>
                setForm((p) => ({ ...p, username: e.target.value }))
              }
              placeholder="Username"
              className="px-4 py-2 border rounded-xl"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="Email"
              className="px-4 py-2 border rounded-xl"
            />
            <input
              value={form.telNumber}
              onChange={(e) =>
                setForm((p) => ({ ...p, telNumber: e.target.value }))
              }
              placeholder="Tel Number"
              className="px-4 py-2 border rounded-xl"
            />

            <div className="md:col-span-5 flex gap-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
              >
                {editingId ? "Update" : "Add"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-5 py-2 rounded-xl border bg-white hover:bg-gray-100"
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
            <p className="font-semibold text-gray-800">Teachers</p>
            {loading && <p className="text-sm text-gray-500">Loading...</p>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Teacher Name</th>
                  <th className="p-3">Subjects</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Tel Number</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {teachers.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan="6">
                      No teachers yet.
                    </td>
                  </tr>
                ) : (
                  teachers.map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="p-3">{t.name}</td>
                      <td className="p-3">{t.subjects}</td>
                      <td className="p-3">{t.username}</td>
                      <td className="p-3">{t.email}</td>
                      <td className="p-3">{t.telNumber}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(t)}
                            className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => remove(t.id)}
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