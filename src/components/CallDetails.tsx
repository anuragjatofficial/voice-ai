"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  Clock,
  DollarSign,
  FileText,
  Play,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Activity,
  MessageSquare
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
      structuredData?: unknown;
    };
  }

  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchCallDetails();
  }, [callId]);

  const fetchCallDetails = async () => {
    try {
      const response = await fetch(`/api/calls/${callId}`);
      if (response.ok) {
        const data = await response.json();
        setCall(data.call);
      }
    } catch (error) {
      console.error('Error fetching call details:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncCallData = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/calls/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setCall(data.callLog);
      }
    } catch (error) {
      console.error('Error syncing call data:', error);
    } finally {
      setSyncing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ended':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Activity className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-20 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Call details not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(call.status)}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Call Details
              </h3>
              <p className="text-sm text-gray-500">
                VAPI Call ID: {call.vapiCallId || 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={syncCallData}
            disabled={syncing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Data'}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Call Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Duration</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {call.duration ? formatDuration(call.duration) : 'N/A'}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Cost</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ${call.cost ? call.cost.toFixed(4) : '0.0000'}
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">Status</span>
            </div>
            <p className="text-lg font-semibold text-purple-600 capitalize">
              {call.status}
            </p>
          </div>
        </div>

        {/* Cost Breakdown */}
        {call.costBreakdown && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Cost Breakdown</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(call.costBreakdown).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">{key}</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${(value as number).toFixed(4)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcript */}
        {call.transcript && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Transcript
              </h4>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                <Download className="w-4 h-4 inline mr-1" />
                Download
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
              <p className="text-gray-900 whitespace-pre-wrap">{call.transcript}</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {call.messages && call.messages.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              Conversation
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {call.messages.map((message: { role: string; time: number; message: string }, index: number) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === 'assistant'
                      ? 'bg-blue-50 ml-4'
                      : 'bg-gray-50 mr-4'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-600 uppercase">
                      {message.role}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.time * 1000).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-900">{message.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {call.summary && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Summary</h4>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-900">{call.summary}</p>
            </div>
          </div>
        )}

        {/* Recording */}
        {call.recordingUrl && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Recording</h4>
            <div className="flex items-center gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2">
                <Play className="w-4 h-4" />
                Play Recording
              </button>
              <a
                href={call.recordingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
        )}

        {/* Analysis */}
        {call.analysis && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">AI Analysis</h4>
            <div className="bg-purple-50 p-4 rounded-lg">
              {call.analysis.successEvaluation && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Success Evaluation:</p>
                  <p className="text-gray-900">{call.analysis.successEvaluation}</p>
                </div>
              )}
              {call.analysis.structuredData !== undefined && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Structured Data:</p>
                  <pre className="text-sm text-gray-900 bg-white p-2 rounded border overflow-x-auto">
                    {JSON.stringify(call.analysis.structuredData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}