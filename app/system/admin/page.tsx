"use client";
import React, { useEffect, useState } from "react";

interface ActivityLog {
  _id: string;
  userId: string;
  email?: string;
  event: string;
  details?: any;
  createdAt: string;
}

interface DemoRequest {
  _id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  createdAt: string;
}

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/activity")
      .then((r) => r.json())
      .then((data) => setLogs(data.logs || []));
    fetch("/api/admin/demo-requests")
      .then((r) => r.json())
      .then((data) => setRequests(data.requests || []))
      .finally(() => setLoading(false));
  }, []);

  const approveRequest = async (id: string) => {
    setApproving(id);
    try {
      const res = await fetch(`/api/admin/demo-requests/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demoRequestId: id, action: "approve" }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to approve request");
      } else {
        setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: "approved" } : r)));
      }
    } catch (err) {
      alert("Failed to approve request");
    }
    setApproving(null);
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>ThinkBox Admin Analytics</h1>
      <h2 style={{ fontSize: 20, fontWeight: 600, margin: "32px 0 12px" }}>Pending Demo Requests</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 32 }}>
        <thead>
          <tr style={{ background: "#f7f7f7" }}>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: "center", color: "#aaa" }}>No requests</td></tr>
          )}
          {requests.map((r) => (
            <tr key={r._id} style={{ background: r.status === "approved" ? "#eaffea" : undefined }}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.company}</td>
              <td>{r.status}</td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
              <td>
                {r.status !== "approved" && (
                  <button onClick={() => approveRequest(r._id)} disabled={approving === r._id}>
                    {approving === r._id ? "Approving..." : "Approve"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 style={{ fontSize: 20, fontWeight: 600, margin: "32px 0 12px" }}>Recent Activity Logs</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f7f7f7" }}>
            <th>User</th>
            <th>Email</th>
            <th>Event</th>
            <th>Details</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign: "center", color: "#aaa" }}>No logs</td></tr>
          )}
          {logs.map((l) => (
            <tr key={l._id}>
              <td>{l.userId}</td>
              <td>{l.email || "-"}</td>
              <td>{l.event}</td>
              <td>{typeof l.details === "object" ? JSON.stringify(l.details) : l.details || "-"}</td>
              <td>{new Date(l.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
