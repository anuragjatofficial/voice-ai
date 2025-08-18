import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { CallLog, Patient } from '@/lib/models';

export async function GET() {
  try {
    await connectToDatabase;
    const calls = await CallLog.find({})
      .populate('patientId', 'name phone')
      .sort({ createdAt: -1 });
    return NextResponse.json({ calls });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch calls' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase;
    const { patientId } = await request.json();
    
    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    
    // Create call log
    const callLog = new CallLog({
      patientId,
      callStatus: 'initiated',
      startTime: new Date()
    });
    
    await callLog.save();
    
    // Populate patient data for response
    await callLog.populate('patientId', 'name phone');
    
    return NextResponse.json({ callLog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create call log' }, { status: 500 });
  }
}