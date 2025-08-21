import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VapiService from "@/lib/vapi";
import CallLog from "@/lib/models/CallLog";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { callId } = body;

    if (!callId) {
      return NextResponse.json(
        { error: "Call ID is required" },
        { status: 400 }
      );
    }

    // Find the call log
    const callLog = await CallLog.findOne({ 
      $or: [
        { _id: callId },
        { vapiCallId: callId }
      ]
    });

    if (!callLog) {
      return NextResponse.json(
        { error: "Call log not found" },
        { status: 404 }
      );
    }

    if (!callLog.vapiCallId) {
      return NextResponse.json(
        { error: "No VAPI call ID associated with this call" },
        { status: 400 }
      );
    }

    // Fetch latest data from VAPI
    const vapiCall = await VapiService.getCall(callLog.vapiCallId);

    // Update call log with latest data
    callLog.status = vapiCall.status;
    if (vapiCall.startedAt) callLog.startedAt = new Date(vapiCall.startedAt);
    if (vapiCall.endedAt) callLog.endedAt = new Date(vapiCall.endedAt);
    if (vapiCall.cost) callLog.cost = vapiCall.cost;
    if (vapiCall.costBreakdown) callLog.costBreakdown = vapiCall.costBreakdown;
    if (vapiCall.transcript) callLog.transcript = vapiCall.transcript;
    if (vapiCall.summary) callLog.summary = vapiCall.summary;
    if (vapiCall.recordingUrl) callLog.recordingUrl = vapiCall.recordingUrl;
    if (vapiCall.messages) callLog.messages = vapiCall.messages;
    if (vapiCall.analysis) callLog.analysis = vapiCall.analysis;

    // Calculate duration if we have start and end times
    if (callLog.startedAt && callLog.endedAt) {
      callLog.duration = Math.floor(
        (callLog.endedAt.getTime() - callLog.startedAt.getTime()) / 1000
      );
    }

    await callLog.save();

    return NextResponse.json({
      success: true,
      message: "Call data synced successfully",
      callLog: callLog.toObject(),
      vapiCall,
    });

  } catch (error) {
    console.error("Error syncing call data:", error);
    return NextResponse.json(
      { error: "Failed to sync call data" },
      { status: 500 }
    );
  }
}