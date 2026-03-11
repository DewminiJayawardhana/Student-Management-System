import React, { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function ChangeHistoryModal({ open, onClose, entityType, entityKey }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get(`/api/history?entityType=${entityType}&entityKey=${entityKey}`);
      setLogs(res.data || []);
    } catch {
      setErr("Cannot load history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
   
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">Change History</h3>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-1">
          {entityType} — {entityKey}
        </p>

        {err && <p className="text-red-600 text-sm mt-3">{err}</p>}
        {loading && <p className="text-sm text-gray-500 mt-3">Loading...</p>}

        <div className="mt-4 max-h-[420px] overflow-auto border rounded-xl">
          {logs.length === 0 ? (
            <p className="p-4 text-gray-500">No history yet.</p>
          ) : (
            <ul className="divide-y">
              {logs.map((l) => (
                <li key={l.id} className="p-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="text-sm">
                      <span className="font-semibold">{l.actorRole}</span>{" "}
                      <span className="text-gray-700">{l.actorUsername}</span>
                      <span className="text-gray-500"> • {l.action}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(l.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{l.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={load}
            className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-100"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}