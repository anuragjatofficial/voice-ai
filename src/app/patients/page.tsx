"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Phone,
  Eye,
  ArrowLeft,
  RefreshCw,
  Plus,
  Search,
  Filter,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Mail,
  MapPin,
  Calendar,
  ChevronDown,
  Check
} from "lucide-react";

interface Patient {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  status: string;
  notes?: string;
  createdAt: string;
  mrn?: string;
  address?: {
    city?: string;
    state?: string;
  };
}

// Modern Dropdown Component
const Dropdown = ({ value, onChange, options, placeholder = "Select option" }: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find(opt => opt.value === value) || options[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: typeof options[0]) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
      >
        <span className="flex items-center">
          {selectedOption?.icon && (
            <span className="mr-2">{selectedOption.icon}</span>
          )}
          <span className="block truncate text-sm text-gray-900">
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none border border-gray-200 animate-in fade-in-0 zoom-in-95">
          {options.map((option) => (
            <div
              key={option.value}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 transition-colors duration-150 ${
                option.value === selectedOption?.value ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
              }`}
              onClick={() => handleSelect(option)}
            >
              <div className="flex items-center">
                {option.icon && (
                  <span className="mr-2">{option.icon}</span>
                )}
                <span className={`block truncate text-sm ${
                  option.value === selectedOption?.value ? 'font-medium' : 'font-normal'
                }`}>
                  {option.label}
                </span>
              </div>

              {option.value === selectedOption?.value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                  <Check className="w-4 h-4" />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function PatientsClient() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dropdown options with icons
  const statusOptions = [
    { 
      value: "all", 
      label: "All Status", 
      icon: <Filter className="w-4 h-4 text-gray-400" /> 
    },
    { 
      value: "active", 
      label: "Active", 
      icon: <CheckCircle className="w-4 h-4 text-emerald-500" /> 
    },
    { 
      value: "pending", 
      label: "Pending", 
      icon: <Clock className="w-4 h-4 text-amber-500" /> 
    },
    { 
      value: "completed", 
      label: "Completed", 
      icon: <CheckCircle className="w-4 h-4 text-blue-500" /> 
    },
    { 
      value: "inactive", 
      label: "Inactive", 
      icon: <AlertCircle className="w-4 h-4 text-gray-500" /> 
    }
  ];

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/patients");
      const data = await response.json();
      if (response.ok) {
        setPatients(data.patients || []);
        setError("");
      } else {
        setError(data.error || "Failed to fetch patients");
      }
    } catch {
      setError("Failed to fetch patients");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const initiateCall = async (patientId: string, patientName: string) => {
    try {
      const response = await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      });
      if (response.ok) {
        const data = await response.json();
        showNotification(
          `Call initiated for ${patientName}. Call ID: ${data.callLog._id}`,
          "success"
        );
      } else {
        showNotification("Failed to initiate call", "error");
      }
    } catch {
      showNotification("Error initiating call", "error");
    }
  };

  const seedPatients = async () => {
    try {
      const response = await fetch("/api/patients/seed", {
        method: "POST",
      });
      if (response.ok) {
        fetchPatients();
        showNotification("Sample patients added successfully!", "success");
      } else {
        showNotification("Failed to seed data", "error");
      }
    } catch {
      showNotification("Failed to seed data", "error");
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm) ||
                         patient.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Patients</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchPatients}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                Patient Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and monitor patient records</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition-colors duration-200 inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={fetchPatients}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            notification.type === "success" ? "bg-emerald-50 border-emerald-400 text-emerald-800" :
            notification.type === "error" ? "bg-red-50 border-red-400 text-red-800" :
            "bg-blue-50 border-blue-400 text-blue-800"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {notification.type === "success" && <CheckCircle className="w-5 h-5 mr-2" />}
                {notification.type === "error" && <AlertCircle className="w-5 h-5 mr-2" />}
                {notification.type === "info" && <AlertCircle className="w-5 h-5 mr-2" />}
                {notification.message}
              </div>
              <button
                onClick={() => setNotification(null)}
                className="ml-4 text-current hover:opacity-70 transition-opacity duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <Dropdown
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                placeholder="Filter by status"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredPatients.length === 0 && patients.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Patients Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by adding some sample patient data to begin managing your patient records.
            </p>
            <button
              onClick={seedPatients}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
              disabled={refreshing}
            >
              <Plus className="w-5 h-5" />
              Add Sample Patients
            </button>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Matching Patients</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Patients ({filteredPatients.length})
                </h3>
                <button
                  onClick={seedPatients}
                  className="text-sm bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded-lg transition-colors duration-200 inline-flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Sample Data
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPatients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {patient.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{patient.name}</div>
                            {patient.mrn && (
                              <div className="text-sm text-gray-500">MRN: {patient.mrn}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {patient.phone}
                          </div>
                          {patient.email && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {patient.email}
                            </div>
                          )}
                          {patient.address?.city && (
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              {patient.address.city}, {patient.address.state}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}>
                          {getStatusIcon(patient.status)}
                          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => initiateCall(patient._id, patient.name)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2 text-sm font-medium"
                            disabled={refreshing}
                          >
                            <Phone className="w-4 h-4" />
                            Call
                          </button>
                          <Link
                            href={`/patients/${patient._id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2 text-sm font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredPatients.length} of {patients.length} patients
        </div>
      </div>
    </div>
  );
}
