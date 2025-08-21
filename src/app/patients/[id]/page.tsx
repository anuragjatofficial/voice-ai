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
  Shield,
  Users,
  DollarSign,
  Heart,
  Flag,
  Baby,
  CreditCard,
  UserCheck,
  Home,
  Briefcase,
  Globe
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
  // Extended demographic fields
  insurance?: {
    provider?: string;
    policyNumber?: string;
    memberName?: string;
    groupNumber?: string;
    effectiveDate?: string;
    expiryDate?: string;
  };
  pregnancyStatus?: string;
  income?: {
    annualIncome?: number;
    verified?: boolean;
    householdSize?: number;
  };
  familyMembers?: Array<{
    name?: string;
    relationship?: string;
    dateOfBirth?: string;
    income?: {
      annualIncome?: number;
    };
  }>;
  usCitizenshipStatus?: string;
  asyleeRefugeeStatus?: string;
  race?: string;
  ethnicity?: string;
  preferredLanguage?: string;
  maritalStatus?: string;
  occupation?: string;
  employer?: string;
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
    },
    insurance: {
      provider: "",
      policyNumber: "",
      memberName: "",
      groupNumber: "",
      effectiveDate: "",
      expiryDate: ""
    },
    pregnancyStatus: "",
    income: {
      annualIncome: 0,
      verified: false,
      householdSize: 1
    },
    usCitizenshipStatus: "",
    asyleeRefugeeStatus: "",
    race: "",
    ethnicity: "",
    preferredLanguage: "",
    maritalStatus: "",
    occupation: "",
    employer: ""
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
          dateOfBirth: data.patient.dateOfBirth ? new Date(data.patient.dateOfBirth).toISOString().split('T')[0] : "",
          gender: data.patient.gender || "",
          emergencyContact: {
            name: data.patient.emergencyContact?.name || "",
            phone: data.patient.emergencyContact?.phone || "",
            relationship: data.patient.emergencyContact?.relationship || ""
          },
          insurance: {
            provider: data.patient.insurance?.provider || "",
            policyNumber: data.patient.insurance?.policyNumber || "",
            memberName: data.patient.insurance?.memberName || "",
            groupNumber: data.patient.insurance?.groupNumber || "",
            effectiveDate: data.patient.insurance?.effectiveDate ? new Date(data.patient.insurance.effectiveDate).toISOString().split('T')[0] : "",
            expiryDate: data.patient.insurance?.expiryDate ? new Date(data.patient.insurance.expiryDate).toISOString().split('T')[0] : ""
          },
          pregnancyStatus: data.patient.pregnancyStatus || "",
          income: {
            annualIncome: data.patient.income?.annualIncome || 0,
            verified: data.patient.income?.verified || false,
            householdSize: data.patient.income?.householdSize || 1
          },
          usCitizenshipStatus: data.patient.usCitizenshipStatus || "",
          asyleeRefugeeStatus: data.patient.asyleeRefugeeStatus || "",
          race: data.patient.race || "",
          ethnicity: data.patient.ethnicity || "",
          preferredLanguage: data.patient.preferredLanguage || "",
          maritalStatus: data.patient.maritalStatus || "",
          occupation: data.patient.occupation || "",
          employer: data.patient.employer || ""
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
      // Reset form to original patient data
      fetchPatient();
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
      
      const data = await response.json();
      
      if (response.ok) {
        showNotification(
          `Call initiated for ${patient.name}. Call ID: ${data.callLog._id}`,
          "success"
        );
      } else {
        if (data.suggestion) {
          showNotification(`${data.error}: ${data.suggestion}`, "error");
        } else {
          showNotification(data.error || "Failed to initiate call", "error");
        }
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

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto p-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
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
      <div className="max-w-6xl mx-auto p-6">
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
                  Patient Demographics
                </h1>
                <p className="text-gray-600 mt-1">Complete patient information and demographics</p>
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
                <div className="flex items-center gap-4 mt-1">
                  {patient.mrn && (
                    <p className="text-gray-600">MRN: {patient.mrn}</p>
                  )}
                  {patient.dateOfBirth && (
                    <p className="text-gray-600">
                      Age: {calculateAge(patient.dateOfBirth)} years
                    </p>
                  )}
                  {patient.gender && (
                    <p className="text-gray-600 capitalize">{patient.gender}</p>
                  )}
                </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  {editing ? (
                    <input
                      type="date"
                      value={editForm.dateOfBirth}
                      onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {patient.dateOfBirth 
                        ? new Date(patient.dateOfBirth).toLocaleDateString()
                        : "Not provided"
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  {editing ? (
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 capitalize">
                      {patient.gender || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Race</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.race}
                      onChange={(e) => setEditForm({...editForm, race: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., White, Black, Asian"
                    />
                  ) : (
                    <p className="text-gray-900">{patient.race || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ethnicity</label>
                  {editing ? (
                    <select
                      value={editForm.ethnicity}
                      onChange={(e) => setEditForm({...editForm, ethnicity: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Ethnicity</option>
                      <option value="hispanic_latino">Hispanic or Latino</option>
                      <option value="not_hispanic_latino">Not Hispanic or Latino</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {patient.ethnicity ? patient.ethnicity.replace('_', ' ') : "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.preferredLanguage}
                      onChange={(e) => setEditForm({...editForm, preferredLanguage: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., English, Spanish"
                    />
                  ) : (
                    <p className="text-gray-900">{patient.preferredLanguage || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                  {editing ? (
                    <select
                      value={editForm.maritalStatus}
                      onChange={(e) => setEditForm({...editForm, maritalStatus: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                      <option value="separated">Separated</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 capitalize">
                      {patient.maritalStatus || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact & Address */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-green-600" />
                Contact & Address
              </h3>
              
              <div className="space-y-3">
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

                {editing ? (
                  <div className="space-y-2">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
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
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                <div className="pt-3 border-t border-green-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                  {editing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Contact Name"
                        value={editForm.emergencyContact.name}
                        onChange={(e) => setEditForm({
                          ...editForm, 
                          emergencyContact: {...editForm.emergencyContact, name: e.target.value}
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        placeholder="Contact Phone"
                        value={editForm.emergencyContact.phone}
                        onChange={(e) => setEditForm({
                          ...editForm, 
                          emergencyContact: {...editForm.emergencyContact, phone: e.target.value}
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Relationship"
                        value={editForm.emergencyContact.relationship}
                        onChange={(e) => setEditForm({
                          ...editForm, 
                          emergencyContact: {...editForm.emergencyContact, relationship: e.target.value}
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <div>
                      {patient.emergencyContact?.name ? (
                        <>
                          <p className="text-gray-900 font-medium">{patient.emergencyContact.name}</p>
                          {patient.emergencyContact.phone && (
                            <p className="text-gray-600">{patient.emergencyContact.phone}</p>
                          )}
                          {patient.emergencyContact.relationship && (
                            <p className="text-gray-600 capitalize">{patient.emergencyContact.relationship}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500">Not provided</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Medical & Insurance */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-purple-600" />
                Medical & Insurance
              </h3>
              
              <div className="space-y-3">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pregnancy Status</label>
                  {editing ? (
                    <select
                      value={editForm.pregnancyStatus}
                      onChange={(e) => setEditForm({...editForm, pregnancyStatus: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Status</option>
                      <option value="not_applicable">Not Applicable</option>
                      <option value="pregnant">Pregnant</option>
                      <option value="postpartum">Postpartum</option>
                      <option value="not_pregnant">Not Pregnant</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Baby className="w-4 h-4 text-gray-400" />
                      <span className="capitalize">
                        {patient.pregnancyStatus?.replace('_', ' ') || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Insurance Information */}
                <div className="pt-3 border-t border-purple-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Insurance
                  </label>
                  {editing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Insurance Provider"
                        value={editForm.insurance.provider}
                        onChange={(e) => setEditForm({
                          ...editForm, 
                          insurance: {...editForm.insurance, provider: e.target.value}
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Policy Number"
                        value={editForm.insurance.policyNumber}
                        onChange={(e) => setEditForm({
                          ...editForm, 
                          insurance: {...editForm.insurance, policyNumber: e.target.value}
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Member Name"
                        value={editForm.insurance.memberName}
                        onChange={(e) => setEditForm({
                          ...editForm, 
                          insurance: {...editForm.insurance, memberName: e.target.value}
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <div>
                      {patient.insurance?.provider ? (
                        <>
                          <p className="text-gray-900 font-medium">{patient.insurance.provider}</p>
                          {patient.insurance.policyNumber && (
                            <p className="text-gray-600">Policy: {patient.insurance.policyNumber}</p>
                          )}
                          {patient.insurance.memberName && (
                            <p className="text-gray-600">Member: {patient.insurance.memberName}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500">No insurance information</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-amber-600" />
                Financial Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
                  {editing ? (
                    <input
                      type="number"
                      value={editForm.income.annualIncome}
                      onChange={(e) => setEditForm({
                        ...editForm, 
                        income: {...editForm.income, annualIncome: parseInt(e.target.value) || 0}
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {patient.income?.annualIncome 
                        ? formatCurrency(patient.income.annualIncome)
                        : "Not provided"
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Household Size</label>
                  {editing ? (
                    <input
                      type="number"
                      value={editForm.income.householdSize}
                      onChange={(e) => setEditForm({
                        ...editForm, 
                        income: {...editForm.income, householdSize: parseInt(e.target.value) || 1}
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {patient.income?.householdSize || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Income Verified</label>
                  {editing ? (
                    <select
                      value={editForm.income.verified ? "true" : "false"}
                      onChange={(e) => setEditForm({
                        ...editForm, 
                        income: {...editForm.income, verified: e.target.value === "true"}
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      {patient.income?.verified ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-700">Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span className="text-amber-700">Not verified</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Employment */}
                <div className="pt-3 border-t border-amber-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Employment
                  </label>
                  {editing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Occupation"
                        value={editForm.occupation}
                        onChange={(e) => setEditForm({...editForm, occupation: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Employer"
                        value={editForm.employer}
                        onChange={(e) => setEditForm({...editForm, employer: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <div>
                      {patient.occupation || patient.employer ? (
                        <>
                          {patient.occupation && (
                            <p className="text-gray-900">{patient.occupation}</p>
                          )}
                          {patient.employer && (
                            <p className="text-gray-600">{patient.employer}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500">Not provided</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Citizenship & Legal Status */}
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Flag className="w-5 h-5 text-indigo-600" />
                Citizenship & Legal Status
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">US Citizenship Status</label>
                  {editing ? (
                    <select
                      value={editForm.usCitizenshipStatus}
                      onChange={(e) => setEditForm({...editForm, usCitizenshipStatus: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Status</option>
                      <option value="citizen">US Citizen</option>
                      <option value="naturalized_citizen">Naturalized Citizen</option>
                      <option value="permanent_resident">Permanent Resident</option>
                      <option value="temporary_resident">Temporary Resident</option>
                      <option value="non_resident">Non-Resident</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-gray-400" />
                      <span className="capitalize">
                        {patient.usCitizenshipStatus?.replace('_', ' ') || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asylee/Refugee Status</label>
                  {editing ? (
                    <select
                      value={editForm.asyleeRefugeeStatus}
                      onChange={(e) => setEditForm({...editForm, asyleeRefugeeStatus: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Status</option>
                      <option value="neither">Neither</option>
                      <option value="asylee">Asylee</option>
                      <option value="refugee">Refugee</option>
                      <option value="pending_asylum">Pending Asylum</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="capitalize">
                        {patient.asyleeRefugeeStatus?.replace('_', ' ') || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Family Members */}
            <div className="bg-rose-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-rose-600" />
                Family Members
              </h3>
              
              <div className="space-y-3">
                {patient.familyMembers && patient.familyMembers.length > 0 ? (
                  patient.familyMembers.map((member, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-rose-200">
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{member.relationship}</p>
                      {member.dateOfBirth && (
                        <p className="text-sm text-gray-600">
                          Born: {new Date(member.dateOfBirth).toLocaleDateString()}
                        </p>
                      )}
                      {member.income?.annualIncome && (
                        <p className="text-sm text-gray-600">
                          Income: {formatCurrency(member.income.annualIncome)}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No family members listed</p>
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