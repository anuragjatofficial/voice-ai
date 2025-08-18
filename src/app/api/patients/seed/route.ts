import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Patient } from "@/lib/models";

const samplePatients = [
  {
    name: "John Doe",
    phone: "+91-9876543210",
    email: "john.doe@email.com",
    status: "active",
    notes: "Regular checkup patient"
  },
  {
    name: "Jane Smith",
    phone: "+91-9876543211",
    email: "jane.smith@email.com",
    status: "pending",
    notes: "New patient consultation needed"
  },
  {
    name: "Bob Johnson",
    phone: "+91-9876543212",
    email: "bob.johnson@email.com",
    status: "active",
    notes: "Follow-up appointment scheduled"
  }
];

export async function POST() {
  try {
    await connectToDatabase;

    // Clear existing patients
    await Patient.deleteMany({});

    // Insert sample patients
    const patients = await Patient.insertMany(samplePatients);

    return NextResponse.json({
      message: "Sample patients created successfully",
      count: patients.length,
      patients
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to seed patients" }, { status: 500 });
  }
}
