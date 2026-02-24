import React, { createContext, useContext, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const isAuthed = !!token;

  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    // your backend returns: token, role, name, email
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ role: data.role, name: data.name, email: data.email }));
    setToken(data.token);
    setUser({ role: data.role, name: data.name, email: data.email });
  };

  const register = async (payload) => {
    // payload: { name,email,password,role }
    await api.post("/api/auth/register", payload);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, isAuthed, login, register, logout }), [token, user, isAuthed]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}