# VoiceAI System Architecture

This document explains how our VoiceAI system works end-to-end: what parts exist, how they talk to each other, and how data flows between client systems and our application.

## High-Level Diagram

```
Patient (Phone) ──▶ VAPI Voice Assistant ──▶ Webhook (Next.js API)
                                       │
                                       └──▶ Next.js App (UI + API)
                                               │
                          MSSQL (Client DB) ───┤  Prisma (read-only)
                                               │
                                            MongoDB (Primary DB)
```

## Core Components

- Next.js App (Frontend + API)
  - UI pages: patients, calls, dashboard, analytics
  - API routes: patient CRUD, call management, analytics, webhooks
- VAPI (AI Voice Assistant)
  - Handles outbound/inbound calls, collects structured data
  - Sends call reports and updates to our webhook
- MongoDB (Primary Storage)
  - Stores patients, call logs, analytics snapshots
- Client MSSQL (External System)
  - Source of truth for client’s existing patient records
  - We read via Prisma and sync to Mongo
- Prisma (ORM for MSSQL)
  - Simple, read-only access layer to MSSQL via `PRISMA_MSSQL_URL`

## Data Flow

1. Patient Sync (MSSQL → Mongo)
   - A scheduled or manual POST to `/api/patients/sync` reads patient rows from MSSQL using Prisma.
   - We upsert into Mongo by `mrn` (medical record number) to avoid duplicates.
   - Phone numbers stay unique: if a phone conflicts with a different MRN, we keep the existing record and log a conflict.
   - Result: Mongo stays aligned with client MSSQL while respecting our app constraints.

2. Calls via VAPI
   - Staff starts a call from the UI, or we schedule calls (future).
   - VAPI calls the patient, collects structured answers (e.g., insurance, pregnancy status).
   - On call completion and status changes, VAPI POSTs to `/api/vapi/webhook`.

3. Webhook Processing
   - We validate the event, parse structured fields, and update the relevant Mongo records.
   - Call logs, transcripts, cost breakdowns, and analytics are saved for reporting.

4. UI & Reporting
   - Pages read from Mongo to show live patient data, call details, and analytics dashboards.
   - Staff can review conflicts, verify data, and manage patients.

## Key Design Decisions

- Single Source of Truth in-App: MongoDB
  - We consolidate all operational data in Mongo for speed and simplicity.
- Read-Only Integration to Client DB
  - Prisma connects to MSSQL only to read and sync; we don’t write back to client systems.
- Safe Upsert Strategy
  - Upsert by `mrn`; keep `phone` unique to avoid cross-patient collisions.
- Event-Driven Updates
  - VAPI sends webhooks so we can update records as calls progress or end.

## Reliability & Security

- Database Connections
  - MongoDB via secure URI; MSSQL via `PRISMA_MSSQL_URL`.
- Webhook Integrity
  - Signature/secret support (configurable) to trust inbound VAPI events.
- Error Handling
  - Sync reports `fetched`, `upserted`, `skipped`, `conflicts`; webhook logs for diagnostics.
- Least Privilege
  - Prisma uses read-only access to MSSQL; no write operations to client DB.

## Rollout Plan (MSSQL Integration)

- Configure
  - Obtain the client MSSQL connection string; set `PRISMA_MSSQL_URL`.
  - Map Prisma model fields to actual client table/column names.
- Generate & Test
  - `npm run prisma:generate` to create the MSSQL client.
  - Smoke-test sync with a small dataset; verify upsert behavior.
- Monitor
  - Review conflicts reported by `/api/patients/sync`.
  - Validate random samples match client MSSQL.
- Schedule (Optional)
  - Add a cron (platform-dependent) to run sync daily or hourly.

## Notes

- The system integrates client data safely and read-only.
- Patient records in our app come from two sources: client MSSQL (bulk sync) and VAPI call outcomes (incremental updates).
- MongoDB is our operational hub; the UI and analytics read from it for speed and reliability.
- If the client updates their MSSQL schema, we only need to adjust Prisma mappings—no broad rewrites.

## Glossary

- VAPI: AI voice platform we use for automated calls.
- Webhook: Secure HTTP endpoint that receives VAPI events.
- Prisma: Database ORM used here for MSSQL reads.
- Upsert: Insert new or update existing record based on a unique key (here: `mrn`).
