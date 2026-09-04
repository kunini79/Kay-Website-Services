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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Store token in memory for this session
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    // Legacy archive access uses the existing admin request endpoint.
    if (!email || !password) {
      setLoginError("Email and password required");
      return;
    }
    // Try to fetch with admin password
    try {
      const res = await fetch("/api/admin/demo-requests", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setToken(password);
        fetchData(password);
      } else {
        setLoginError("Invalid credentials");
      }
    } catch {
      setLoginError("Login failed");
    }
  };

  const fetchData = (adminToken: string) => {
    setLoading(true);
    fetch("/api/activity")
      .then((r) => r.json())
      .then((data) => setLogs(data.logs || []));
    fetch("/api/admin/demo-requests", {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((r) => r.json())
      .then((data) => setRequests(data.requests || []))
      .finally(() => setLoading(false));
  };

  const approveRequest = async (id: string) => {
    setApproving(id);
    try {
      const res = await fetch(`/api/admin/demo-requests/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: 400, margin: "80px auto", padding: 24, border: "1px solid #eee", borderRadius: 12, background: "#fff" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 12 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", padding: 8, fontSize: 16 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: "100%", padding: 8, fontSize: 16 }}
            />
          </div>
          {loginError && <div style={{ color: "#c00", marginBottom: 10 }}>{loginError}</div>}
          <button type="submit" style={{ width: "100%", padding: 10, fontSize: 16, fontWeight: 700, background: "#58CC02", color: "#fff", border: "none", borderRadius: 8 }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>ThinkBox Admin Analytics</h1>
      <h2 style={{ fontSize: 20, fontWeight: 600, margin: "32px 0 12px" }}>Legacy Access Requests</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 32 }}>
        <thead>
          <tr style={{ background: "#f7f7f7" }}>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Status</th>
            <th>Created</th>
            <th>Archive</th>
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
              <td>Testing closed</td>
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
