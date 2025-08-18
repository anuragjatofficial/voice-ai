import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Patient } from '@/lib/models';

export async function GET() {
  try {
    await connectToDatabase;
    console.log('Fetching patients...');
    const patients = await Patient.find({}).sort({ createdAt: -1 });
    console.log(patients,"patients:");
    
    return NextResponse.json({ patients });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase;
    const body = await request.json();
    const patient = new Patient(body);
    await patient.save();
    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}