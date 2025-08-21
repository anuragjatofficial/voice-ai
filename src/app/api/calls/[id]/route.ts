import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CallLog from "@/lib/models/CallLog";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const call = await CallLog.findById(id).populate('patientId', 'name phone');
    
    if (!call) {
      return NextResponse.json(
        { error: "Call not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      call
    });

  } catch (error) {
    console.error("Error fetching call:", error);
    return NextResponse.json(
      { error: "Failed to fetch call details" },
      { status: 500 }
    );
  }
}