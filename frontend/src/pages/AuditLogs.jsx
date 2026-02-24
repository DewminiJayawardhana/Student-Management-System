import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/audit-logs");
      setLogs(data);
    } catch {
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#A40033]">Audit Logs</h2>

      <div className="mt-4 bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F5F5F5]">
              <tr>
                <th className="text-left p-3">Action</th>
                <th className="text-left p-3">Entity</th>
                <th className="text-left p-3">Entity ID</th>
                <th className="text-left p-3">By</th>
                <th className="text-left p-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="p-3">{l.action}</td>
                  <td className="p-3">{l.entityType}</td>
                  <td className="p-3">{l.entityId}</td>
                  <td className="p-3">{l.userEmail}</td>
                  <td className="p-3">{l.createdAt}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td className="p-3" colSpan="5">No logs</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}