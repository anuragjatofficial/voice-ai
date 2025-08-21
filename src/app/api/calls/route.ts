import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Patient } from "@/lib/models";
import VapiService from "@/lib/vapi";
import CallLog from "@/lib/models/CallLog";

export async function GET() {
  try {
    await connectDB();
    
    const calls = await CallLog.find()
      .populate('patientId', 'name phone email')
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({
      success: true,
      calls: calls.map(call => ({
        ...call.toObject(),
        patientName: call.patientId?.name || 'Unknown',
      })),
    });
  } catch (error) {
    console.error("Error fetching calls:", error);
    return NextResponse.json(
      { error: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { patientId, assistantId, metadata } = body;

    // Fetch patient details
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    // Create call log entry
    const callLog = new CallLog({
      patientId,
      phoneNumber: patient.phone,
      status: "queued",
      metadata: {
        patientName: patient.name,
        patientEmail: patient.email,
        ...metadata,
      },
    });

    await callLog.save();

    // Initiate VAPI call
    try {
      const vapiCall = await VapiService.createCall({
        phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID!,
        assistantId: assistantId || process.env.VAPI_ASSISTANT_ID!,
        customer: {
          number: patient.phone,
          name: patient.name,
        },
        metadata: {
          callLogId: callLog._id.toString(),
          patientId: patient._id.toString(),
          patientName: patient.name,
        },
      });

      // Update call log with VAPI call ID
      callLog.vapiCallId = vapiCall.id;
      callLog.status = vapiCall.status;
      if (vapiCall.startedAt) {
        callLog.startedAt = new Date(vapiCall.startedAt);
      }
      await callLog.save();

      return NextResponse.json({
        success: true,
        message: "Call initiated successfully",
        callLog: {
          ...callLog.toObject(),
          patientName: patient.name,
        },
        vapiCall,
      });

    } catch (vapiError) {
      // Update call log with error
      callLog.status = "failed";
      callLog.error = vapiError instanceof Error ? vapiError.message : "Unknown VAPI error";
      await callLog.save();

      return NextResponse.json(
        { 
          error: "Failed to initiate call with VAPI",
          details: vapiError instanceof Error ? vapiError.message : "Unknown error",
          callLog: callLog.toObject(),
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error creating call:", error);
    return NextResponse.json(
      { error: "Failed to create call" },
      { status: 500 }
    );
  }
}