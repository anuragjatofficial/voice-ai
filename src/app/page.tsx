"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Phone,
  Calendar,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  BarChart3,
  PieChart,
  Headphones,
  UserPlus,
  PhoneCall,
  MessageSquare,
  Bell,
  Settings,
  Search,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";

interface DashboardStats {
  totalPatients: number;
  activeCalls: number;
  scheduledCalls: number;
  completedToday: number;
  recentPatients: Array<{
    _id: string;
    name: string;
    phone: string;
    status: string;
    createdAt: string;
  }>;
  recentCalls: Array<{
    _id: string;
    patientName: string;
    duration: number;
    status: string;
    createdAt: string;
  }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activeCalls: 0,
    scheduledCalls: 0,
    completedToday: 0,
    recentPatients: [],
    recentCalls: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      // Fetch patients data
      const patientsResponse = await fetch("/api/patients");
      const patientsData = await patientsResponse.json();
      
      // Fetch calls data
      const callsResponse = await fetch("/api/calls");
      const callsData = await callsResponse.json();

      if (patientsResponse.ok && callsResponse.ok) {
        const patients = patientsData.patients || [];
        const calls = callsData.calls || [];
        
        // Calculate stats
        const today = new Date().toDateString();
        const completedToday = calls.filter((call: {
          _id: string;
          patientName: string;
          duration: number;
          status: string;
          createdAt: string;
        }) => 
          new Date(call.createdAt).toDateString() === today && call.status === 'completed'
        ).length;

        setStats({
          totalPatients: patients.length,
          activeCalls: calls.filter((call: { _id: string; patientName: string; duration: number; status: string; createdAt: string; }) => call.status === 'active').length,
          scheduledCalls: calls.filter((call: { _id: string; patientName: string; duration: number; status: string; createdAt: string; }) => call.status === 'scheduled').length,
          completedToday,
          recentPatients: patients.slice(0, 5),
          recentCalls: calls.slice(0, 5)
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showNotification("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    trend?: number;
    description?: string;
  }

  const StatCard = ({ title, value, icon, color, trend, description }: StatCardProps) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600 font-medium">{trend}% from last week</span>
        </div>
      )}
    </div>
  );

  interface QuickActionButtonProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    color: string;
  }

  const QuickActionButton = ({ title, description, icon, href, color }: QuickActionButtonProps) => (
    <Link
      href={href}
      className={`block p-6 rounded-xl border-2 border-dashed ${color} hover:bg-opacity-5 transition-all duration-200 group`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
        <div className="flex items-center">
          {icon}
          <ArrowRight className="w-5 h-5 text-gray-400 ml-2 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20" />
                      <div className="h-8 bg-gray-200 rounded w-16" />
                    </div>
                    <div className="h-12 w-12 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
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
                <Activity className="w-8 h-8 text-blue-600" />
                Voice AI Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchDashboardData}
                disabled={refreshing}
                className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition-colors duration-200 inline-flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 inline-flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<Users className="w-6 h-6 text-blue-600" />}
            color="bg-blue-50"
            trend={12}
            description="Registered patients"
          />
          <StatCard
            title="Active Calls"
            value={stats.activeCalls}
            icon={<Phone className="w-6 h-6 text-green-600" />}
            color="bg-green-50"
            description="Currently in progress"
          />
          <StatCard
            title="Scheduled Today"
            value={stats.scheduledCalls}
            icon={<Calendar className="w-6 h-6 text-amber-600" />}
            color="bg-amber-50"
            description="Calls pending"
          />
          <StatCard
            title="Completed Today"
            value={stats.completedToday}
            icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}
            color="bg-emerald-50"
            trend={8}
            description="Successful calls"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionButton
              title="Manage Patients"
              description="View, add, or edit patient information"
              icon={<Users className="w-6 h-6 text-blue-600" />}
              href="/patients"
              color="border-blue-200 hover:bg-blue-50"
            />
            <QuickActionButton
              title="Call History"
              description="Review past calls and analytics"
              icon={<PhoneCall className="w-6 h-6 text-green-600" />}
              href="/calls"
              color="border-green-200 hover:bg-green-50"
            />
            <QuickActionButton
              title="Voice Analytics"
              description="AI insights and call analytics"
              icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
              href="/analytics"
              color="border-purple-200 hover:bg-purple-50"
            />
          </div>
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Patients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  Recent Patients
                </h3>
                <Link
                  href="/patients"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {stats.recentPatients.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentPatients.map((patient) => (
                    <div key={patient._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          patient.status === 'active' ? 'bg-green-100 text-green-800' :
                          patient.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.status}
                        </span>
                        <Link
                          href={`/patients/${patient._id}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No patients yet</p>
                  <Link
                    href="/patients"
                    className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Patient
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Calls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-green-600" />
                  Recent Calls
                </h3>
                <Link
                  href="/calls"
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {stats.recentCalls.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentCalls.map((call) => (
                    <div key={call._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{call.patientName}</p>
                        <p className="text-sm text-gray-500">
                          {call.duration ? `${call.duration}s` : 'Duration unknown'} • {new Date(call.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          call.status === 'completed' ? 'bg-green-100 text-green-800' :
                          call.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {call.status}
                        </span>
                        <Phone className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PhoneCall className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No calls yet</p>
                  <Link
                    href="/patients"
                    className="inline-flex items-center gap-2 mt-3 text-green-600 hover:text-green-700 font-medium"
                  >
                    <Phone className="w-4 h-4" />
                    Start Call
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Voice AI Service</span>
              </div>
              <span className="text-green-600 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Database</span>
              </div>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Call Service</span>
              </div>
              <span className="text-green-600 font-medium">Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
