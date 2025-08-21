import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CallLog from "@/lib/models/CallLog";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, call } = body;

    console.log('VAPI Webhook received:', { type, callId: call?.id });

    await connectDB();

    // Find the call log by VAPI call ID
    const callLog = await CallLog.findOne({ vapiCallId: call.id });
    
    if (!callLog) {
      console.error('Call log not found for VAPI call ID:', call.id);
      return NextResponse.json(
        { error: "Call log not found" },
        { status: 404 }
      );
    }

    // Update call log based on webhook type
    switch (type) {
      case 'call-start':
        callLog.status = 'in-progress';
        callLog.startedAt = new Date(call.startedAt);
        break;

      case 'call-end':
        callLog.status = 'ended';
        callLog.endedAt = new Date(call.endedAt);
        if (call.cost) callLog.cost = call.cost;
        if (call.costBreakdown) callLog.costBreakdown = call.costBreakdown;
        if (call.transcript) callLog.transcript = call.transcript;
        if (call.summary) callLog.summary = call.summary;
        if (call.recordingUrl) callLog.recordingUrl = call.recordingUrl;
        if (call.messages) callLog.messages = call.messages;
        if (call.analysis) callLog.analysis = call.analysis;
        
        // Calculate duration if we have start and end times
        if (callLog.startedAt && callLog.endedAt) {
          callLog.duration = Math.floor(
            (callLog.endedAt.getTime() - callLog.startedAt.getTime()) / 1000
          );
        }
        break;

      case 'call-forwarding':
        callLog.status = 'forwarding';
        break;

      case 'call-ringing':
        callLog.status = 'ringing';
        break;

      default:
        console.log('Unhandled webhook type:', type);
        break;
    }

    await callLog.save();

    return NextResponse.json({
      success: true,
      message: `Webhook ${type} processed successfully`,
    });

  } catch (error) {
    console.error("Error processing VAPI webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}