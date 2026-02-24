import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const emptyForm = { fullName: "", email: "", phone: "", address: "", grade: "", active: true };

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/students");
      setStudents(data);
    } catch (e) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    try {
      if (editingId) {
        await api.put(`/api/students/${editingId}`, form);
        toast.success("Student updated");
      } else {
        await api.post("/api/students", form);
        toast.success("Student created");
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Save failed");
    }
  };

  const startEdit = (s) => {
    // IMPORTANT: your backend update takes an id param.
    // From your earlier Postman you used /api/students/STU-2026-0002
    // So your controller probably uses studentCode as path variable (not Mongo _id).
    // We'll assume: studentCode in `s.studentCode`.
    setEditingId(s.studentCode || s.id);
    setForm({
      fullName: s.fullName || "",
      email: s.email || "",
      phone: s.phone || "",
      address: s.address || "",
      grade: s.grade || "",
      active: !!s.active,
    });
  };

  const remove = async (s) => {
    if (!window.confirm(`Delete ${s.studentCode || s.id}?`)) return;
    try {
      await api.delete(`/api/students/${s.studentCode || s.id}`);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const exportCsv = async () => {
    try {
      const res = await api.get("/api/students/export", { responseType: "blob" });
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "students.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed");
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-bold text-[#A40033]">Students</h2>
        <button onClick={exportCsv} className="bg-[#C82C41] text-white px-3 py-2 rounded hover:bg-[#A40033]">
          Export CSV
        </button>
      </div>

      <div className="mt-4 bg-white rounded-xl shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Full Name" value={form.fullName} onChange={(e) => onChange("fullName", e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => onChange("email", e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Address" value={form.address} onChange={(e) => onChange("address", e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Grade" value={form.grade} onChange={(e) => onChange("grade", e.target.value)} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.active} onChange={(e) => onChange("active", e.target.checked)} />
            Active
          </label>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={submit} className="bg-[#C82C41] text-white px-3 py-2 rounded hover:bg-[#A40033]">
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              onClick={() => { setEditingId(null); setForm(emptyForm); }}
              className="bg-[#D9D9D9] px-3 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F5F5F5]">
              <tr>
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Grade</th>
                <th className="text-left p-3">Active</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id || s.studentCode} className="border-t">
                  <td className="p-3">{s.studentCode}</td>
                  <td className="p-3">{s.fullName}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">{s.grade}</td>
                  <td className="p-3">{String(!!s.active)}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => startEdit(s)} className="px-2 py-1 rounded bg-[#D9D9D9]">Edit</button>
                    <button onClick={() => remove(s)} className="px-2 py-1 rounded bg-black text-white">Delete</button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td className="p-3" colSpan="6">No students</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}