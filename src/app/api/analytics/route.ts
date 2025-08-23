import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CallLog from "@/lib/models/CallLog";
import { Patient } from "@/lib/models";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get basic stats
    const [totalCalls, totalPatients, successfulCalls, recentCalls] = await Promise.all([
      CallLog.countDocuments(),
      Patient.countDocuments(),
      CallLog.countDocuments({ status: { $in: ['completed', 'ended'] } }),
      CallLog.find()
        .populate('patientId', 'name phone')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean()
    ]);

    // Calculate total cost and average duration
    const costAndDurationStats = await CallLog.aggregate([
      {
        $group: {
          _id: null,
          totalCost: { $sum: "$cost" },
          avgDuration: { $avg: "$duration" },
          calls: { $sum: 1 }
        }
      }
    ]);

    const stats = costAndDurationStats[0] || { totalCost: 0, avgDuration: 0 };

    // Format recent calls for frontend
    const formattedRecentCalls = recentCalls.map(call => ({
      _id: call._id,
      status: call.status,
      duration: call.duration,
      cost: call.cost,
      createdAt: call.createdAt,
      patient: call.patientId ? {
        name: (call.patientId as { name: string; phone: string }).name,
        phone: (call.patientId as { name: string; phone: string }).phone
      } : null
    }));

    return NextResponse.json({
      totalCalls,
      totalPatients,
      successfulCalls,
      totalCost: stats.totalCost || 0,
      avgDuration: stats.avgDuration || 0,
      recentCalls: formattedRecentCalls
    });

  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}