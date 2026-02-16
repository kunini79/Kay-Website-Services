'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader as LoaderIcon, Mail, Building, User } from 'lucide-react';

interface DemoRequest {
  _id: string;
  name: string;
  email: string;
  company: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export default function AdminDemoRequestsPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/demo-requests', {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid password');
      }

      setIsAuthenticated(true);
      fetchRequests(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async (adminPassword: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/demo-requests?status=${filter}`, {
        headers: {
          Authorization: `Bearer ${adminPassword}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      setRequests(data.requests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId);
    setError(null);

    try {
      const response = await fetch('/api/admin/demo-requests/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({
          demoRequestId: requestId,
          action: 'approve',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve request');
      }

      // Refresh the list
      fetchRequests(password);
      setSelectedRequestId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    setError(null);

    try {
      const response = await fetch('/api/admin/demo-requests/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({
          demoRequestId: requestId,
          action: 'reject',
          reason: rejectionReason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject request');
      }

      // Refresh the list
      fetchRequests(password);
      setSelectedRequestId(null);
      setRejectionReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject request');
    } finally {
      setProcessingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <form onSubmit={handleLogin} className="bg-gray-800 rounded-lg border border-gray-700 p-8">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">Admin Dashboard</h1>
            <p className="text-gray-400 text-center mb-8">Demo Request Management</p>

            {error && (
              <div className="bg-red-900/30 border border-red-600/50 text-red-400 p-4 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BBFD6A]"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#BBFD6A] hover:bg-[#a9e65e] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Demo Requests</h1>
              <p className="text-gray-400">Review and manage ThinkBox demo access requests</p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-600/50 text-red-400 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          {['pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setFilter(tab as any);
                fetchRequests(password);
              }}
              className={`pb-4 px-6 font-semibold transition-colors capitalize ${
                filter === tab
                  ? 'text-[#BBFD6A] border-b-2 border-[#BBFD6A]'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab === 'pending' && '📋 Pending'}
              {tab === 'approved' && '✅ Approved'}
              {tab === 'rejected' && '❌ Rejected'}
            </button>
          ))}
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="text-center py-12">
            <LoaderIcon className="inline-block w-8 h-8 text-[#BBFD6A] animate-spin" />
            <p className="text-gray-400 mt-4">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg">No {filter} requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Name</p>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-[#BBFD6A]" />
                      <p className="text-white font-semibold">{request.name}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-[#BBFD6A]" />
                      <p className="text-white">{request.email}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Company</p>
                    <div className="flex items-center gap-2">
                      <Building size={16} className="text-[#BBFD6A]" />
                      <p className="text-white">{request.company}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Submitted</p>
                    <p className="text-white">{new Date(request.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {request.message && (
                  <div className="mb-4 p-3 bg-gray-700/50 rounded border border-gray-600">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Message</p>
                    <p className="text-gray-200">{request.message}</p>
                  </div>
                )}

                {request.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-900/20 rounded border border-red-600/30">
                    <p className="text-xs text-red-400 uppercase tracking-wide mb-1">Rejection Reason</p>
                    <p className="text-red-200">{request.rejectionReason}</p>
                  </div>
                )}

                {/* Actions */}
                {request.status === 'pending' && (
                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700">
                    {selectedRequestId === request._id ? (
                      <div className="flex-1 space-y-3">
                        <textarea
                          placeholder="Rejection reason (optional)"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BBFD6A] resize-none"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(request._id)}
                            disabled={processingId === request._id}
                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
                          >
                            {processingId === request._id ? (
                              <>
                                <LoaderIcon size={16} className="animate-spin" />
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <XCircle size={16} />
                                Confirm Reject
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setSelectedRequestId(null)}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleApprove(request._id)}
                          disabled={processingId === request._id}
                          className="flex-1 bg-[#BBFD6A] hover:bg-[#a9e65e] disabled:opacity-50 text-black font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
                        >
                          {processingId === request._id ? (
                            <>
                              <LoaderIcon size={16} className="animate-spin" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <CheckCircle size={16} />
                              Approve & Send Credentials
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setSelectedRequestId(request._id)}
                          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                )}

                {request.status === 'approved' && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={18} />
                    <span className="font-semibold">Approved on {new Date(request.approvedAt || '').toLocaleDateString()}</span>
                  </div>
                )}

                {request.status === 'rejected' && (
                  <div className="flex items-center gap-2 text-red-400">
                    <XCircle size={18} />
                    <span className="font-semibold">Rejected</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
