# Voice-AI User Guide

This document provides a walkthrough of the main pages, components, and API endpoints in the **Voice-AI** platform (`anuragjatofficial/voice-ai`).  
> **Note:** Due to search result limits, this guide may not include every page or component. For the most complete, up-to-date list, please see the [pages directory](https://github.com/anuragjatofficial/voice-ai/tree/main/pages) and [components directory](https://github.com/anuragjatofficial/voice-ai/tree/main/src/components) on GitHub.

---

## Pages

### `/` (Home)
- The main landing page of the application.
- Provides general navigation and welcome information.

### `/api`
- Backend API route directory.
- Handles server-side logic such as database operations, authentication, and integration with VAPI.

### `/calls`
- Displays a list of automated patient calls.
- Shows statuses, timestamps, and links to call details.
- Allows access to call logs and history, including analytics.

### `/dashboard`
- Analytics dashboard.
- Summarizes call performance, patient engagement, and operational statistics with charts and insights.

### `/patients`
- Patient management page.
- Lists patients and allows searching, viewing, and editing patient demographic information.

### `/settings`
- Configuration and system settings.
- Lets users adjust VAPI integration, database, and notification settings.

### `/voice`
- Voice interaction module.
- Demo or live page for initiating and monitoring voice-based patient calls.

### `/profile`
- User profile management.
- Lets users view and update their account information and preferences.

---

## Components

### `CallDetails`
[View source](https://github.com/anuragjatofficial/voice-ai/blob/main/src/components/CallDetails.tsx)
- Used to render details about a specific patient call.
- Shows call status, duration, cost, transcript, summary, structured patient data, and analysis.
- Includes controls for syncing data, copying transcripts, and downloading call recordings.
- Fetches call data from `/api/calls/:callId` and provides error handling.

---

## API Endpoints (Examples)

> **📚 For complete API documentation:** Please refer to the "API Documentation" section in README.md (starting from the '🔧 API Documentation' heading). It contains detailed request/response examples, all available endpoints, and complete data structures.

Quick Reference of Common Endpoints:
- `GET /api/calls`: List all patient calls.
- `GET /api/calls/:callId`: Get details of a specific call (used by `CallDetails` component).
- `POST /api/calls/sync`: Sync a call log with VAPI and update local data.
- Other available endpoints:
  - `/api/patients`: Patient CRUD operations.
  - `/api/settings`: System settings update.
  - `/api/voice`: Initiate or manage voice calls via VAPI.

---

## Usage Instructions

- **Home Page**: Start here to navigate to other modules.
- **Calls**: Monitor active and completed patient calls; click any call for full details and analytics.
- **Dashboard**: Review statistics and trends in voice call performance.
- **Patients**: Register, view, or edit patient information.
- **Settings**: Configure platform integrations and personal preferences.
- **Voice**: Run or test voice AI calls.
- **Profile**: Manage your user credentials and preferences.

---