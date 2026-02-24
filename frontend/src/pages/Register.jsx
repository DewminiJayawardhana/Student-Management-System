import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const { register } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ name, email, password, role });
      toast.success("Registered. Now login.");
      nav("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-[#A40033]">Register</h1>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input className="w-full border rounded px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <select className="w-full border rounded px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="STUDENT">STUDENT</option>
            <option value="STAFF">STAFF</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <button className="w-full bg-[#C82C41] text-white rounded px-3 py-2 hover:bg-[#A40033]">
            Register
          </button>
        </form>

        <div className="mt-4 text-sm">
          Have account? <Link className="text-[#C82C41] underline" to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}