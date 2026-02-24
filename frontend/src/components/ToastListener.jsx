import { useEffect } from "react";
import { toast } from "react-toastify";

export default function ToastListener() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // IMPORTANT: your backend SSE endpoint path must match here
    // Example: /api/notifications/stream  (adjust to your NotificationController mapping)
    const url = `http://localhost:8081/api/notifications/stream?token=${encodeURIComponent(token)}`;

    const es = new EventSource(url);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // expect something like:
        // { message: "Student STU-2026-0002 updated by Staff (Nimal)" }
        toast.info(data.message || event.data);
      } catch {
        toast.info(event.data);
      }
    };

    es.onerror = () => {
      // auto reconnect happens, but can notify once if you want
      // toast.error("Notification connection lost");
    };

    return () => es.close();
  }, []);

  return null;
}