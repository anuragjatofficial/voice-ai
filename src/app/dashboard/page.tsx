"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Phone, 
  Users, 
  BarChart3, 
  DollarSign, 
  ArrowLeft,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Calendar,
  Activity,
  Zap,
  Target,
  Eye,
  Settings,
  Bell,
  Search,
  Filter
} from "lucide-react";

interface DashboardStats {
  totalCalls: number;
  totalPatients: number;
  successfulCalls: number;
  totalCost: number;
  avgDuration: number;
  recentCalls: Array<{
    _id: string;
    status: string;
    duration?: number;
    cost?: number;
    createdAt: string;
    patient?: {
      name: string;
      phone: string;
    };
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('7d');

  useEffect(() => {
    fetchDashboardStats();
  }, [timeFilter]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`/api/analytics?period=${timeFilter}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const totalSeconds = Math.round(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSuccessRate = () => {
    if (!stats?.totalCalls) return 0;
    return Math.round((stats.successfulCalls / stats.totalCalls) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'ended':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'in-progress':
        return 'bg-blue-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
      case 'ended':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* <Link 
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6 cursor-pointer transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Back to Home</span>
              </Link> */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">VoiceAI</span>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search calls, patients..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-text transition-all duration-200"
                />
              </div>

              {/* Navigation Links */}
              <Link 
                href="/calls" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-100"
              >
                Calls
              </Link>
              <Link 
                href="/patients" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-100"
              >
                Patients
              </Link>
              <Link 
                href="/analytics" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-100"
              >
                Analytics
              </Link>
              
              {/* Action Buttons */}
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-gray-600 text-lg">Here&apos;s what&apos;s happening with your voice AI system today.</p>
            </div>
            
            {/* Time Filter */}
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                <Filter className="w-4 h-4 text-gray-500 ml-2" />
                {['24h', '7d', '30d', '90d'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeFilter(period)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-all duration-200 ${
                      timeFilter === period
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {period === '24h' ? 'Today' : 
                     period === '7d' ? 'Week' :
                     period === '30d' ? 'Month' : 'Quarter'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Calls */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Calls</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalCalls || 0}</p>
                <div className="mt-3 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+12%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Patients */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalPatients || 0}</p>
                <div className="mt-3 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+8%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900">{getSuccessRate()}%</p>
                <div className="mt-3 flex items-center">
                  <Target className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-600 font-medium">Excellent</span>
                  <span className="text-sm text-gray-500 ml-1">performance</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Total Cost */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Cost</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalCost || 0)}</p>
                <div className="mt-3 flex items-center">
                  <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-600 font-medium">Avg: {formatDuration(stats?.avgDuration)}</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-7 h-7 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link 
            href="/calls"
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">View All Calls</h3>
              <div className="flex items-center">
                <Phone className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300 mr-2" />
                <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
            <p className="text-gray-600 mb-3">Manage and review all your voice AI calls with detailed analytics and recordings.</p>
            <div className="flex items-center text-sm text-blue-600 font-medium">
              <Activity className="w-4 h-4 mr-1" />
              {stats?.totalCalls || 0} calls tracked
            </div>
          </Link>

          <Link 
            href="/patients"
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 border border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Manage Patients</h3>
              <div className="flex items-center">
                <Users className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform duration-300 mr-2" />
                <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
            <p className="text-gray-600 mb-3">View and update patient information, demographics, and call history.</p>
            <div className="flex items-center text-sm text-green-600 font-medium">
              <Users className="w-4 h-4 mr-1" />
              {stats?.totalPatients || 0} patients registered
            </div>
          </Link>

          <Link 
            href="/analytics"
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6 border border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
              <div className="flex items-center">
                <BarChart3 className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform duration-300 mr-2" />
                <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
            <p className="text-gray-600 mb-3">Deep insights and performance metrics with advanced reporting tools.</p>
            <div className="flex items-center text-sm text-purple-600 font-medium">
              <Zap className="w-4 h-4 mr-1" />
              Real-time insights
            </div>
          </Link>
        </div>

        {/* Enhanced Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center mr-3">
                  <Activity className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-600">Latest calls and interactions</p>
                </div>
              </div>
              <Link 
                href="/calls"
                className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer transition-colors duration-200 hover:underline"
              >
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {stats?.recentCalls && stats.recentCalls.length > 0 ? (
              <div className="space-y-4">
                {stats.recentCalls.slice(0, 5).map((call, index) => (
                  <div 
                    key={call._id} 
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:bg-gray-50"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-4 animate-pulse ${getStatusColor(call.status)}`}></div>
                      <div className="flex items-center mr-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mr-3">
                          <Phone className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {call.patient?.name || 'Unknown Patient'}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{call.patient?.phone}</span>
                            <span>•</span>
                            <span className="capitalize">{getStatusText(call.status)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-500" />
                          {formatDuration(call.duration)}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
                          {formatCurrency(call.cost || 0)}
                        </p>
                      </div>
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No recent calls</h4>
                <p className="text-gray-600 mb-4">Start making calls to see activity here</p>
                <Link 
                  href="/calls"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Start calling
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
