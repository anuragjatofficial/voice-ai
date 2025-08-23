"use client";

import { useState, useEffect } from "react";
import { 
  Phone, 
  Clock, 
  DollarSign, 
  FileText, 
  Download, 
  RefreshCw,
  User,
  Calendar,
  Mail,
  MapPin,
  CreditCard,
  Baby,
  Users,
  Flag,
  Briefcase,
  Copy,
  Check
} from "lucide-react";

interface CallDetailsProps {
  callId: string;
}

export default function CallDetails({ callId }: CallDetailsProps) {
  interface Call {
    vapiCallId?: string;
    status: string;
    duration?: number;
    cost?: number;
    costBreakdown?: { [key: string]: number };
    transcript?: string;
    messages?: {
      role: string;
      time: number;
      message: string;
    }[];
    summary?: string;
    recordingUrl?: string;
    analysis?: {
      successEvaluation?: string;
      structuredData?: {
        patient_name?: string;
        patient_phone?: string;
        email?: string;
        date_of_birth?: string;
        address?: string;
        mrn?: string;
        insurance?: string;
        is_pregnant?: string;
        income?: string;
        is_us_citizen?: string;
        is_asylee_or_refugee?: string;
        family_member_name?: string;
        relationship?: string;
        family_member_dob?: string;
        family_member_income?: string;
      };
    };
    patientId?: {
      _id: string;
      name: string;
      phone: string;
      email?: string;
    };
    createdAt: string;
    startedAt?: string;
    endedAt?: string;
  }

  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  useEffect(() => {
    fetchCallDetails();
  }, [callId]);

  const fetchCallDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/calls/${callId}`);
      const data = await response.json();
      
      if (response.ok) {
        setCall(data.call);
        setError("");
      } else {
        setError(data.error || "Failed to fetch call details");
      }
    } catch (err) {
      console.error("Error fetching call details:", err);
      setError("Failed to fetch call details");
    } finally {
      setLoading(false);
    }
  };

  const syncCallData = async () => {
    try {
      setSyncing(true);
      const response = await fetch("/api/calls/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callLogId: callId })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCall(data.callLog);
        setError("");
      } else {
        setError(data.error || "Failed to sync call data");
      }
    } catch (err) {
      console.error("Error syncing call data:", err);
      setError("Failed to sync call data");
    } finally {
      setSyncing(false);
    }
  };

   const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const totalSeconds = Math.round(seconds); // Round to nearest whole second
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTranscript(true);
      setTimeout(() => setCopiedTranscript(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedTranscript(true);
      setTimeout(() => setCopiedTranscript(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading call details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchCallDetails}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">Call not found</p>
      </div>
    );
  }

  const structuredData = call.analysis?.structuredData;

  return (
    <div className="space-y-6">
      {/* Call Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Call Overview</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={syncCallData}
              disabled={syncing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Data'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium capitalize text-gray-400">{call.status}</p>
            </div>
          </div>

          {call.duration !== undefined && (
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Duration (in mins)</p>
                <p className="font-medium text-gray-400">{formatDuration(call.duration)}</p>
              </div>
            </div>
          )}

          {call.cost !== undefined && (
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Cost</p>
                <p className="font-medium text-gray-400">{formatCurrency(call.cost)}</p>
              </div>
            </div>
          )}
        </div>

        {call.patientId && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Patient</p>
            <p className="font-medium text-gray-400">{call.patientId.name}</p>
            <p className="text-sm text-gray-500">{call.patientId.phone}</p>
          </div>
        )}
      </div>

      {/* Structured Data */}
      {structuredData && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Collected Patient Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal Information
              </h4>
              
              {structuredData.patient_name && (
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <p className="font-medium text-gray-400">{structuredData.patient_name}</p>
                </div>
              )}
              
              {structuredData.patient_phone && (
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <p className="font-medium text-gray-400">{structuredData.patient_phone}</p>
                </div>
              )}
              
              {structuredData.email && (
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="font-medium text-gray-400">{structuredData.email}</p>
                </div>
              )}
              
              {structuredData.date_of_birth && (
                <div>
                  <label className="text-sm text-gray-600">Date of Birth</label>
                  <p className="font-medium text-gray-400">{new Date(structuredData.date_of_birth).toLocaleDateString()}</p>
                </div>
              )}
              
              {structuredData.address && (
                <div>
                  <label className="text-sm text-gray-600">Address</label>
                  <p className="font-medium text-gray-400">{structuredData.address}</p>
                </div>
              )}
              
              {structuredData.mrn && (
                <div>
                  <label className="text-sm text-gray-600">MRN</label>
                  <p className="font-medium text-gray-400">{structuredData.mrn}</p>
                </div>
              )}
            </div>

            {/* Medical & Financial Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Medical & Financial
              </h4>
              
              {structuredData.insurance && (
                <div>
                  <label className="text-sm text-gray-600">Insurance Provider</label>
                  <p className="font-medium text-gray-400">{structuredData.insurance}</p>
                </div>
              )}
              
              {structuredData.is_pregnant && (
                <div>
                  <label className="text-sm text-gray-600">Pregnancy Status</label>
                  <p className="font-medium capitalize text-gray-400">{structuredData.is_pregnant}</p>
                </div>
              )}
              
              {structuredData.income && (
                <div>
                  <label className="text-sm text-gray-600">Income</label>
                  <p className="font-medium text-gray-400">{formatCurrency(parseFloat(structuredData.income))}</p>
                </div>
              )}
              
              {structuredData.is_us_citizen && (
                <div>
                  <label className="text-sm text-gray-600">US Citizen</label>
                  <p className="font-medium capitalize text-gray-400">{structuredData.is_us_citizen}</p>
                </div>
              )}
              
              {structuredData.is_asylee_or_refugee && (
                <div>
                  <label className="text-sm text-gray-600">Asylee/Refugee Status</label>
                  <p className="font-medium capitalize text-gray-400">{structuredData.is_asylee_or_refugee}</p>
                </div>
              )}
            </div>
          </div>

          {/* Family Member Information */}
          {structuredData.family_member_name && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-4">
                <Users className="w-4 h-4" />
                Family Member Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <p className="font-medium text-gray-400">{structuredData.family_member_name}</p>
                </div>
                
                {structuredData.relationship && (
                  <div>
                    <label className="text-sm text-gray-600">Relationship</label>
                    <p className="font-medium capitalize text-gray-400">{structuredData.relationship}</p>
                  </div>
                )}
                
                {structuredData.family_member_dob && (
                  <div>
                    <label className="text-sm text-gray-600">Date of Birth</label>
                    <p className="font-medium text-gray-400">{new Date(structuredData.family_member_dob).toLocaleDateString()}</p>
                  </div>
                )}
                
                {structuredData.family_member_income && (
                  <div>
                    <label className="text-sm text-gray-600">Income</label>
                    <p className="font-medium text-gray-400">{formatCurrency(parseFloat(structuredData.family_member_income))}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cost Breakdown */}
      {call.costBreakdown && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(call.costBreakdown).map(([key, value]) => (
              <div key={key} className="text-center">
                <p className="text-sm text-gray-600 capitalize">{key}</p>
                <p className="font-medium text-gray-400">{formatCurrency(value as number)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transcript */}
      {call.transcript && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Transcript
            </h3>
            <button
              onClick={() => copyToClipboard(call.transcript!)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition-colors duration-200 cursor-pointer"
            >
              {copiedTranscript ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">{call.transcript}</pre>
          </div>
        </div>
      )}

      {/* Summary */}
      {call.summary && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <p className="text-gray-700">{call.summary}</p>
        </div>
      )}

      {/* Recording */}
      {call.recordingUrl && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Recording
          </h3>
          <audio controls className="w-full">
            <source src={call.recordingUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}