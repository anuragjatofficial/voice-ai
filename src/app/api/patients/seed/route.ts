import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Patient } from "@/lib/models";

const samplePatients = [
	{
		name: "John Doe",
		phone: "+91-9876543210",
		email: "john.doe@email.com",
		mrn: "MRN001",
		address: {
			street: "123 Main St",
			city: "Springfield",
			state: "IL",
			zipCode: "62701",
			country: "USA",
		},
		dateOfBirth: new Date("1985-06-15"),
		insurance: {
			provider: "Blue Cross Blue Shield",
			policyNumber: "BC123456789",
			memberName: "John Doe",
		},
		pregnancyStatus: "not_applicable",
		income: {
			annualIncome: 45000,
			verified: true,
		},
		familyMembers: [
			{
				name: "Jane Doe",
				relationship: "spouse",
				dateOfBirth: new Date("1987-03-22"),
				income: {
					annualIncome: 42000,
				},
			},
		],
		usCitizenshipStatus: "citizen",
		asyleeRefugeeStatus: "neither",
		status: "active",
		notes: "Regular checkup patient",
	},
	{
		name: "Jane Smith",
		phone: "+91-9876543211",
		email: "jane.smith@email.com",
		mrn: "MRN002",
		address: {
			street: "456 Oak Ave",
			city: "Chicago",
			state: "IL",
			zipCode: "60601",
			country: "USA",
		},
		dateOfBirth: new Date("1992-11-08"),
		pregnancyStatus: "pregnant",
		income: {
			annualIncome: 38000,
			verified: false,
		},
		usCitizenshipStatus: "permanent_resident",
		asyleeRefugeeStatus: "neither",
		status: "pending",
		notes: "New patient consultation needed",
	},
	{
		name: "Bob Johnson",
		phone: "+91-9876543212",
		email: "bob.johnson@email.com",
		mrn: "MRN003",
		address: {
			street: "789 Pine St",
			city: "Aurora",
			state: "IL",
			zipCode: "60506",
			country: "USA",
		},
		dateOfBirth: new Date("1978-09-30"),
		insurance: {
			provider: "Aetna",
			policyNumber: "AET987654321",
			memberName: "Bob Johnson",
		},
		pregnancyStatus: "not_applicable",
		income: {
			annualIncome: 65000,
			verified: true,
		},
		familyMembers: [
			{
				name: "Alice Johnson",
				relationship: "child",
				dateOfBirth: new Date("2010-05-12"),
			},
		],
		usCitizenshipStatus: "citizen",
		asyleeRefugeeStatus: "neither",
		status: "active",
		notes: "Follow-up appointment scheduled",
	},
];

export async function POST() {
	try {
		await connectToDatabase();
		console.log("Database connected, proceeding with seed...");

		// Clear existing patients
		await Patient.deleteMany({});
		console.log("Existing patients cleared");

		// Insert sample patients
		const patients = await Patient.insertMany(samplePatients);
		console.log("Sample patients inserted:", patients.length);

		return NextResponse.json({
			message: "Sample patients created successfully",
			count: patients.length,
			patients,
		});
	} catch (error) {
		console.error("Seed error:", error);
		return NextResponse.json(
			{
				error: "Failed to seed patients",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
