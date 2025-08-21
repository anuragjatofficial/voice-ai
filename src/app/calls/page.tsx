"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Clock,
  Users,
  Calendar,
  Filter,
  Search,
  Download,
  Play,
  Pause,
  RefreshCw,
  PhoneCall,
  CheckCircle,
  AlertCircle,
  Timer
} from "lucide-react";

interface Call {
  _id: string;
  patientId: string | { _id: string; name: string; phone: string; email?: string };
  patientName?: string;
  duration?: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  startedAt?: string;
  endedAt?: string;
  transcript?: string;
  phoneNumber?: string;
  vapiCallId?: string;
  error?: string;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/calls");
      const data = await response.json();
      
      if (response.ok) {
        setCalls(data.calls || []);
        setError("");
      } else {
        setError(data.error || "Failed to fetch calls");
      }
    } catch (err) {
      console.error("Error fetching calls:", err);
      setError("Failed to fetch calls");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get patient ID as string
  const getPatientId = (call: Call): string => {
    if (typeof call.patientId === 'string') {
      return call.patientId;
    } else if (call.patientId && typeof call.patientId === 'object' && call.patientId._id) {
      return call.patientId._id;
    }
    return '';
  };

  // Helper function to get patient name
  const getPatientName = (call: Call): string => {
    if (call.patientName) {
      return call.patientName;
    } else if (call.patientId && typeof call.patientId === 'object' && call.patientId.name) {
      return call.patientId.name;
    }
    return 'Unknown Patient';
  };

  const filteredCalls = calls.filter((call) => {
    const patientName = getPatientName(call);
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || call.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "ended":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in-progress":
      case "ringing":
        return <Phone className="w-4 h-4 text-blue-500 animate-pulse" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "queued":
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "ended":
        return "bg-green-50 text-green-700 border-green-200";
      case "in-progress":
      case "ringing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      case "queued":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateDuration = (call: Call): string => {
    if (call.duration) {
      return formatDuration(call.duration);
    }
    
    if (call.startedAt && call.endedAt) {
      const start = new Date(call.startedAt);
      const end = new Date(call.endedAt);
      const durationMs = end.getTime() - start.getTime();
      const durationSeconds = Math.floor(durationMs / 1000);
      return formatDuration(durationSeconds);
    }
    
    return 'N/A';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-48 mb-8" />
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Calls</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchCalls}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-lg border border-gray-200 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <PhoneCall className="w-8 h-8 text-green-600" />
                  Call History
                </h1>
                <p className="text-gray-600 mt-1">Review and manage call records</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition-colors duration-200 inline-flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={fetchCalls}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search calls by patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="ended">Ended</option>
                <option value="in-progress">In Progress</option>
                <option value="ringing">Ringing</option>
                <option value="failed">Failed</option>
                <option value="queued">Queued</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <PhoneCall className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Calls</p>
                <p className="text-2xl font-semibold text-gray-900">{calls.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {calls.filter(c => c.status === 'completed' || c.status === 'ended').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {calls.filter(c => c.status === 'in-progress' || c.status === 'ringing' || c.status === 'queued').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {calls.filter(c => c.status === 'failed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Calls List */}
        {filteredCalls.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <PhoneCall className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {calls.length === 0 ? "No Calls Found" : "No Matching Calls"}
            </h3>
            <p className="text-gray-600 mb-8">
              {calls.length === 0 
                ? "Start making calls to see them appear here." 
                : "Try adjusting your search or filter criteria."
              }
            </p>
            <Link
              href="/patients"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Make a Call
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Calls ({filteredCalls.length})
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCalls.map((call) => {
                    const patientId = getPatientId(call);
                    const patientName = getPatientName(call);
                    
                    return (
                      <tr key={call._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                {patientName.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">{patientName}</div>
                              <div className="text-sm text-gray-500">Call ID: {call._id.slice(-6)}</div>
                              {call.vapiCallId && (
                                <div className="text-xs text-gray-400">VAPI: {call.vapiCallId.slice(-6)}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-900">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {call.phoneNumber || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-900">
                            <Timer className="w-4 h-4 mr-2 text-gray-400" />
                            {calculateDuration(call)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(call.status)}`}>
                            {getStatusIcon(call.status)}
                            {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                          </span>
                          {call.error && (
                            <div className="text-xs text-red-600 mt-1" title={call.error}>
                              Error: {call.error.slice(0, 30)}...
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              {new Date(call.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(call.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {call.transcript && (
                              <button 
                                className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                                title="View transcript"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                            {patientId && (
                              <Link
                                href={`/patients/${patientId}`}
                                className="text-gray-600 hover:text-gray-700 p-1 rounded transition-colors"
                                title="View patient details"
                              >
                                <Users className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}