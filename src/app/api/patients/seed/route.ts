import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const col = db.collection("patients");

  const count = await col.countDocuments();
  if (count > 0) {
    return NextResponse.json({ ok: true, message: "Already seeded", count });
  }

  const docs = [
    {
      patientPhone: "+91XXXXXXXX01",
      patientName: "Rahul Verma",
      address: "DLF Phase 2, Gurgaon",
      email: null,
      dateOfBirth: "1994-07-12",
      medicalRecordNumber: "MRN-1001",
      insuranceInformation: null,
      pregnancyStatus: "N/A",
      income: null,
      familyMembers: [
        { name: "Neha Verma", relationship: "Spouse", dateOfBirth: "1996-03-10", income: 320000 }
      ],
      usCitizenshipStatus: "Non-Citizen",
      asyleeRefugeeStatus: "None",
      status: "pending",
      missingFields: ["email", "insuranceInformation", "income"],
      lastCallStatus: "not-called",
      lastCallAt: null,
      notes: ""
    },
    {
      patientPhone: "+91XXXXXXXX02",
      patientName: "Sneha Gupta",
      address: null,
      email: "sneha@example.com",
      dateOfBirth: "1990-01-25",
      medicalRecordNumber: "MRN-1002",
      insuranceInformation: "CarePlus",
      pregnancyStatus: "No",
      income: 550000,
      familyMembers: [
        { name: "Aarav Gupta", relationship: "Son", dateOfBirth: "2018-09-05", income: 0 }
      ],
      usCitizenshipStatus: "Non-Citizen",
      asyleeRefugeeStatus: "None",
      status: "pending",
      missingFields: ["address"],
      lastCallStatus: "not-called",
      lastCallAt: null,
      notes: ""
    },
    {
      patientPhone: "+91XXXXXXXX03",
      patientName: "Aisha Khan",
      address: "Bandra West, Mumbai",
      email: "aisha.k@example.com",
      dateOfBirth: null,
      medicalRecordNumber: "MRN-1003",
      insuranceInformation: null,
      pregnancyStatus: "Yes",
      income: 300000,
      familyMembers: [],
      usCitizenshipStatus: "Non-Citizen",
      asyleeRefugeeStatus: "None",
      status: "pending",
      missingFields: ["dateOfBirth", "insuranceInformation"],
      lastCallStatus: "not-called",
      lastCallAt: null,
      notes: ""
    },
    {
      patientPhone: "+91XXXXXXXX04",
      patientName: "Rohit Sharma",
      address: "Indiranagar, Bangalore",
      email: "rohit.s@example.com",
      dateOfBirth: "1988-11-02",
      medicalRecordNumber: "MRN-1004",
      insuranceInformation: "MediGuard",
      pregnancyStatus: "N/A",
      income: 700000,
      familyMembers: [
        { name: "Priya Sharma", relationship: "Spouse", dateOfBirth: "1990-05-15", income: 450000 }
      ],
      usCitizenshipStatus: "Non-Citizen",
      asyleeRefugeeStatus: "None",
      status: "completed",
      missingFields: [],
      lastCallStatus: "success",
      lastCallAt: "2025-08-15T10:00:00Z",
      notes: "All good"
    }
  ];

  const result = await col.insertMany(docs);
  return NextResponse.json({ ok: true, inserted: result.insertedCount });
}
