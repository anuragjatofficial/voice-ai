"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Clock,
  Phone,
  Users,
  Activity,
  PieChart,
  Calendar,
  Target,
  Star,
  Zap
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-lg border border-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                Voice Analytics
              </h1>
              <p className="text-gray-600 mt-1">AI-powered insights and call analytics</p>
            </div>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Coming Soon!</h2>
            <p className="text-gray-600 mb-8">
              We&apos;re working on powerful AI analytics to help you understand call patterns, 
              patient sentiment, and optimize your voice AI interactions.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-purple-50 p-4 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Call Trends</h3>
                <p className="text-sm text-gray-600">Track performance over time</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Success Metrics</h3>
                <p className="text-sm text-gray-600">Measure call effectiveness</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Patient Satisfaction</h3>
                <p className="text-sm text-gray-600">Monitor feedback scores</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <Activity className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">AI Insights</h3>
                <p className="text-sm text-gray-600">Automated recommendations</p>
              </div>
            </div>

            <Link
              href="/"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}