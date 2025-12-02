import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Patient as MongoPatient } from "@/lib/models";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type PregnancyStatus = "pregnant" | "not_pregnant" | "unknown" | "not_applicable";
type SystemStatus = "active" | "inactive" | "pending" | "completed";

interface MongoPatientUpdate {
  name: string;
  phone?: string;
  email?: string;
  mrn: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  dateOfBirth?: Date;
  insurance: {
    provider?: string;
    policyNumber?: string;
    memberName?: string;
  };
  pregnancyStatus?: PregnancyStatus;
  income: {
    annualIncome?: number;
    verified: boolean;
  };
  status?: SystemStatus;
  notes?: string;
  updatedAt: Date;
}

function normalizePhone(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  return phone.replace(/\s+/g, "").replace(/[^+\d]/g, "");
}

function mapPregnancyStatus(input?: string | null): PregnancyStatus | undefined {
  if (!input) return undefined;
  const s = String(input).toLowerCase();
  if (["pregnant", "yes", "y", "true"].includes(s)) return "pregnant";
  if (["not_pregnant", "no", "n", "false", "not-pregnant"].includes(s)) return "not_pregnant";
  if (["n/a", "na", "not_applicable", "not-applicable"].includes(s)) return "not_applicable";
  return "unknown";
}

function mapStatus(input?: string | null): SystemStatus | undefined {
  if (!input) return undefined;
  const s = String(input).toLowerCase();
  if (["active", "open"].includes(s)) return "active";
  if (["inactive", "closed"].includes(s)) return "inactive";
  if (["pending", "new"].includes(s)) return "pending";
  if (["completed", "done"].includes(s)) return "completed";
  return undefined;
}

export async function POST() {
  try {
    if (!process.env.PRISMA_MSSQL_URL) {
      return NextResponse.json({ error: "Missing PRISMA_MSSQL_URL in environment" }, { status: 500 });
    }

    await connectToDatabase();

    const externalPatients = await prisma.patient.findMany();

    if (!externalPatients.length) {
      return NextResponse.json({ message: "No patients found in client MSSQL", fetched: 0, upserted: 0, skipped: 0, conflicts: [] });
    }

    let upserted = 0;
    let skipped = 0;
    const conflicts: Array<{ mrn: string; phone: string; conflictingMrn: string }> = [];

    for (const p of externalPatients) {
      const mrn = p.mrn?.trim();
      if (!mrn) {
        skipped += 1;
        continue;
      }

      const phone = normalizePhone(p.phone || undefined);

      const updateDoc: MongoPatientUpdate = {
        name: p.name,
        email: p.email || undefined,
        mrn,
        address: {
          street: p.street || undefined,
          city: p.city || undefined,
          state: p.state || undefined,
          zipCode: p.zipCode || undefined,
          country: p.country || undefined,
        },
        dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth as unknown as string) : undefined,
        insurance: {
          provider: p.insuranceProvider || undefined,
          policyNumber: p.insurancePolicyNumber || undefined,
          memberName: p.insuranceMemberName || undefined,
        },
        pregnancyStatus: mapPregnancyStatus(p.pregnancyStatus),
        income: {
          annualIncome: p.annualIncome ?? undefined,
          verified: (p.incomeVerified ?? false) as boolean,
        },
        status: mapStatus(p.status),
        notes: p.notes || undefined,
        updatedAt: new Date(),
      };

      if (phone) {
        const phoneOwner = await MongoPatient.findOne({ phone, mrn: { $ne: mrn } }).select("mrn");
        if (phoneOwner) {
          conflicts.push({ mrn, phone, conflictingMrn: phoneOwner.mrn });
        } else {
          updateDoc.phone = phone;
        }
      }

      await MongoPatient.findOneAndUpdate(
        { mrn },
        { $set: updateDoc, $setOnInsert: { createdAt: new Date() } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      upserted += 1;
    }

    return NextResponse.json({
      message: "Sync completed",
      fetched: externalPatients.length,
      upserted,
      skipped,
      conflicts,
    });
  } catch (error) {
    console.error("Patient sync failed:", error);
    return NextResponse.json({ error: "Failed to sync patients", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  } finally {
    // Avoid holding open connections between requests
    await prisma.$disconnect().catch(() => {});
  }
}
