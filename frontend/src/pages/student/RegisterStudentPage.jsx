import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiEdit3, FiLock } from "react-icons/fi";
import { api } from "../../api/axios";

export default function RegisterStudentPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); 
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      setLoading(true);
      await api.post("/api/student-auth/register", {
        name: name.trim(),
        username: username.trim(),
        password: password.trim(), 
      });

      navigate("/login", {
        state: { flash: "Student registration successful. Please login." },
      });
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl">
            🎓
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-3">
            Student Registration
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Only admin-added students can register
          </p>
        </div>

        {err && <p className="text-red-600 text-sm text-center mb-3">{err}</p>}

        <form onSubmit={submit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Student Name</label>
            <div className="relative">
              <FiEdit3 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder="Kevin Perera"
                required
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="text-sm text-gray-600">Username</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder="STU00021"
                required
              />
            </div>
          </div>

          {/* ✅ Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register as Student"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full border py-2 rounded-xl hover:bg-gray-50"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}
