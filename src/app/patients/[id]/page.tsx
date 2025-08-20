"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Edit,
  Save,
  X,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Trash2,
  Shield
} from "lucide-react";

interface Patient {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  mrn?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  dateOfBirth?: string;
  gender?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
}

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    email: "",
    status: "",
    notes: "",
    mrn: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    },
    dateOfBirth: "",
    gender: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    }
  });

  useEffect(() => {
    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  const fetchPatient = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/patients/${patientId}`);
      const data = await response.json();
      
      if (response.ok) {
        setPatient(data.patient);
        setEditForm({
          name: data.patient.name || "",
          phone: data.patient.phone || "",
          email: data.patient.email || "",
          status: data.patient.status || "",
          notes: data.patient.notes || "",
          mrn: data.patient.mrn || "",
          address: {
            street: data.patient.address?.street || "",
            city: data.patient.address?.city || "",
            state: data.patient.address?.state || "",
            zipCode: data.patient.address?.zipCode || "",
            country: data.patient.address?.country || ""
          },
          dateOfBirth: data.patient.dateOfBirth || "",
          gender: data.patient.gender || "",
          emergencyContact: {
            name: data.patient.emergencyContact?.name || "",
            phone: data.patient.emergencyContact?.phone || "",
            relationship: data.patient.emergencyContact?.relationship || ""
          }
        });
        setError("");
      } else {
        setError(data.error || "Failed to fetch patient details");
      }
    } catch {
      setError("Failed to fetch patient details");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const data = await response.json();
        setPatient(data.patient);
        setEditing(false);
        showNotification("Patient updated successfully!", "success");
      } else {
        const data = await response.json();
        showNotification(data.error || "Failed to update patient", "error");
      }
    } catch {
      showNotification("Error updating patient", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (patient) {
      setEditForm({
        name: patient.name || "",
        phone: patient.phone || "",
        email: patient.email || "",
        status: patient.status || "",
        notes: patient.notes || "",
        mrn: patient.mrn || "",
        address: {
          street: patient.address?.street || "",
          city: patient.address?.city || "",
          state: patient.address?.state || "",
          zipCode: patient.address?.zipCode || "",
          country: patient.address?.country || ""
        },
        dateOfBirth: patient.dateOfBirth || "",
        gender: patient.gender || "",
        emergencyContact: {
          name: patient.emergencyContact?.name || "",
          phone: patient.emergencyContact?.phone || "",
          relationship: patient.emergencyContact?.relationship || ""
        }
      });
    }
    setEditing(false);
  };

  const initiateCall = async () => {
    if (!patient) return;
    
    try {
      const response = await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: patient._id }),
      });
      
      if (response.ok) {
        const data = await response.json();
        showNotification(
          `Call initiated for ${patient.name}. Call ID: ${data.callLog._id}`,
          "success"
        );
      } else {
        showNotification("Failed to initiate call", "error");
      }
    } catch {
      showNotification("Error initiating call", "error");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-amber-500" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
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
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-48 mb-8" />
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 bg-gray-200 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Patient</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={fetchPatient}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <Link
                href="/patients"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Patients
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/patients"
                className="bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-lg border border-gray-200 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <User className="w-8 h-8 text-blue-600" />
                  Patient Details
                </h1>
                <p className="text-gray-600 mt-1">View and manage patient information</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!editing ? (
                <>
                  <button
                    onClick={initiateCall}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call Patient
                  </button>
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    {saving ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saving ? "Saving..." : "Save"}
                  </button>
                </>
              )}
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
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Patient Overview Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {patient.name.charAt(0).toUpperCase()}
              </div>
              <div>
                {editing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="text-2xl font-bold text-gray-900 border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                )}
                {patient.mrn && (
                  <p className="text-gray-600">MRN: {patient.mrn}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(patient.status)}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(patient.status)}`}>
                {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Demographics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                Contact Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                {editing ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {patient.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {editing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {patient.email || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Address
              </h3>
              
              {editing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={editForm.address.street}
                    onChange={(e) => setEditForm({
                      ...editForm, 
                      address: {...editForm.address, street: e.target.value}
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={editForm.address.city}
                      onChange={(e) => setEditForm({
                        ...editForm, 
                        address: {...editForm.address, city: e.target.value}
                      })}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={editForm.address.state}
                      onChange={(e) => setEditForm({
                        ...editForm, 
                        address: {...editForm.address, state: e.target.value}
                      })}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={editForm.address.zipCode}
                    onChange={(e) => setEditForm({
                      ...editForm, 
                      address: {...editForm.address, zipCode: e.target.value}
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ) : (
                <div>
                  {patient.address?.street && (
                    <p className="text-gray-900">{patient.address.street}</p>
                  )}
                  {patient.address?.city && (
                    <p className="text-gray-900">
                      {patient.address.city}
                      {patient.address.state && `, ${patient.address.state}`}
                      {patient.address.zipCode && ` ${patient.address.zipCode}`}
                    </p>
                  )}
                  {(!patient.address?.city && !patient.address?.street) && (
                    <p className="text-gray-500">Not provided</p>
                  )}
                </div>
              )}
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Medical Info
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                {editing ? (
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    {getStatusIcon(patient.status)}
                    <span>{patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MRN</label>
                {editing ? (
                  <input
                    type="text"
                    value={editForm.mrn}
                    onChange={(e) => setEditForm({...editForm, mrn: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{patient.mrn || "Not assigned"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              Notes
            </h3>
            {editing ? (
              <textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                placeholder="Add patient notes..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 rounded-lg p-3">
                {patient.notes || "No notes available"}
              </p>
            )}
          </div>

          {/* Timestamps */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Created: {new Date(patient.createdAt).toLocaleDateString()}
            </div>
            {patient.updatedAt && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Updated: {new Date(patient.updatedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}