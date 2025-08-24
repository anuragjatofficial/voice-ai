# VoiceAI - Patient Call Dashboard

A comprehensive healthcare communication platform that enables automated AI voice calls for patient data collection and management, built with Next.js, MongoDB, and VAPI integration.

## 🎯 Overview

VoiceAI is a Patient Call Dashboard application that allows healthcare staff to:
- Manage patient records with comprehensive information
- Initiate automated AI voice calls to patients
- Collect structured patient data through AI conversations
- Update patient records automatically from call transcripts
- Monitor call analytics and performance metrics

## 🏗️ Architecture

```
Frontend (Next.js) ↔ API Routes (Next.js) ↔ MongoDB Database
                           ↕
                    VAPI Service Integration
```

- **Frontend**: Next.js with Tailwind CSS for responsive UI
- **Backend**: Next.js API routes handling business logic
- **Database**: MongoDB for persistent storage
- **AI Voice**: VAPI integration for intelligent voice calls
- **Real-time Updates**: Webhook-based call status updates

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB database (local or cloud)
- VAPI account with API credentials

### 1. Clone & Install

```bash
git clone <your-repository-url>
cd voice-ai
npm install
```

### 2. Environment Configuration

Create `.env.local` file in the root directory:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/voice-ai
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/voice-ai

# VAPI Configuration
VAPI_API_KEY=your_vapi_api_key_here
VAPI_ASSISTANT_ID=your_assistant_id_here
VAPI_PHONE_NUMBER_ID=your_phone_number_id_here
VAPI_WEBHOOK_SECRET=your_webhook_secret_here

# Optional: For production deployments
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Database Setup

```bash
# Test database connection
npm run dev
# Visit: http://localhost:3000/api/db-test

# Seed sample patient data
curl -X POST http://localhost:3000/api/patients/seed
```

### 4. VAPI Webhook Configuration

Configure your VAPI assistant to send webhooks to:
```
https://your-domain.com/api/vapi/webhook
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

## 📱 Application Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── patients/          # Patient CRUD operations
│   │   ├── calls/             # Call management
│   │   ├── analytics/         # Dashboard analytics
│   │   └── vapi/             # VAPI webhook handler
│   ├── patients/             # Patient management UI
│   ├── calls/                # Call monitoring UI
│   ├── dashboard/            # Analytics dashboard
│   └── analytics/            # Detailed analytics
├── components/               # Reusable React components
└── lib/                     # Utilities and models
    ├── models.ts           # Database schemas
    ├── mongodb.ts          # Database connection
    └── vapi.ts            # VAPI service integration
```

## 🔧 API Documentation

### Patients API

#### GET /api/patients
Retrieve all patients with pagination support.

**Response:**
```json
{
  "patients": [
    {
      "_id": "60d5ecb74b24c72b64c8e7f1",
      "name": "John Doe",
      "phone": "+1234567890",
      "email": "john.doe@email.com",
      "mrn": "MRN001",
      "address": {
        "street": "123 Main St",
        "city": "Springfield",
        "state": "IL",
        "zipCode": "62701",
        "country": "USA"
      },
      "dateOfBirth": "1985-06-15T00:00:00.000Z",
      "insurance": {
        "provider": "Blue Cross Blue Shield",
        "policyNumber": "BC123456789"
      },
      "pregnancyStatus": "not_applicable",
      "income": {
        "annualIncome": 45000,
        "verified": true,
        "currency": "USD"
      },
      "usCitizenshipStatus": "citizen",
      "asyleeRefugeeStatus": "neither",
      "status": "active",
      "createdAt": "2023-06-25T10:30:00.000Z",
      "updatedAt": "2023-06-25T10:30:00.000Z"
    }
  ]
}
```

#### POST /api/patients
Create a new patient record.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "phone": "+1987654321",
  "email": "jane.smith@email.com",
  "mrn": "MRN002",
  "address": {
    "street": "456 Oak Ave",
    "city": "Chicago",
    "state": "IL",
    "zipCode": "60601",
    "country": "USA"
  },
  "dateOfBirth": "1992-11-08",
  "status": "pending"
}
```

**Response:**
```json
{
  "patient": {
    "_id": "60d5ecb74b24c72b64c8e7f2",
    "name": "Jane Smith",
    "phone": "+1987654321",
    "email": "jane.smith@email.com",
    "status": "pending",
    "createdAt": "2023-06-25T10:35:00.000Z",
    "updatedAt": "2023-06-25T10:35:00.000Z"
  }
}
```

#### GET /api/patients/[id]
Retrieve a specific patient by ID.

**Response:**
```json
{
  "success": true,
  "patient": {
    "_id": "60d5ecb74b24c72b64c8e7f1",
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john.doe@email.com",
    "familyMembers": [
      {
        "name": "Jane Doe",
        "relationship": "spouse",
        "dateOfBirth": "1987-03-22T00:00:00.000Z",
        "income": {
          "annualIncome": 42000,
          "currency": "USD"
        }
      }
    ]
  }
}
```

#### PUT /api/patients/[id]
Update patient information.

**Request Body:**
```json
{
  "name": "John Updated Doe",
  "phone": "+1234567890",
  "email": "john.updated@email.com",
  "status": "active",
  "notes": "Updated contact information"
}
```

#### DELETE /api/patients/[id]
Delete a patient record.

**Response:**
```json
{
  "success": true,
  "message": "Patient deleted successfully"
}
```

### Calls API

#### GET /api/calls
Retrieve all call records with patient information.

**Response:**
```json
{
  "success": true,
  "calls": [
    {
      "_id": "60d5ecb74b24c72b64c8e7f3",
      "patientId": {
        "_id": "60d5ecb74b24c72b64c8e7f1",
        "name": "John Doe",
        "phone": "+1234567890"
      },
      "vapiCallId": "vapi_call_123",
      "status": "ended",
      "duration": 180,
      "cost": 0.45,
      "transcript": "Hello, this is a call to collect your information...",
      "summary": "Successfully collected patient demographics and insurance information.",
      "recordingUrl": "https://recordings.vapi.ai/call_123.mp3",
      "costBreakdown": {
        "transport": 0.15,
        "stt": 0.10,
        "llm": 0.12,
        "tts": 0.08,
        "total": 0.45
      },
      "analysis": {
        "structuredData": {
          "patient_name": "John Doe",
          "patient_phone": "+1234567890",
          "insurance": "Blue Cross Blue Shield",
          "is_pregnant": "no",
          "is_us_citizen": "yes"
        }
      },
      "createdAt": "2023-06-25T11:00:00.000Z",
      "endedAt": "2023-06-25T11:03:00.000Z"
    }
  ]
}
```

#### POST /api/calls
Initiate a new call to a patient.

**Request Body:**
```json
{
  "patientId": "60d5ecb74b24c72b64c8e7f1",
  "assistantId": "optional_custom_assistant_id",
  "metadata": {
    "purpose": "insurance_verification",
    "priority": "high"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Call initiated successfully",
  "callLog": {
    "_id": "60d5ecb74b24c72b64c8e7f3",
    "patientId": "60d5ecb74b24c72b64c8e7f1",
    "vapiCallId": "vapi_call_123",
    "status": "queued",
    "phoneNumber": "+1234567890",
    "createdAt": "2023-06-25T11:00:00.000Z"
  },
  "vapiCall": {
    "id": "vapi_call_123",
    "status": "queued",
    "phoneNumberId": "vapi_phone_456",
    "assistantId": "vapi_assistant_789"
  }
}
```

#### GET /api/calls/[id]
Retrieve specific call details.

**Response:**
```json
{
  "success": true,
  "call": {
    "_id": "60d5ecb74b24c72b64c8e7f3",
    "patientId": {
      "name": "John Doe",
      "phone": "+1234567890"
    },
    "vapiCallId": "vapi_call_123",
    "status": "ended",
    "duration": 180,
    "cost": 0.45,
    "transcript": "Full call transcript...",
    "analysis": {
      "structuredData": {
        "patient_name": "John Doe",
        "date_of_birth": "1985-06-15",
        "insurance": "Blue Cross Blue Shield"
      }
    }
  }
}
```

#### POST /api/calls/sync
Manually sync call data from VAPI.

**Request Body:**
```json
{
  "callId": "60d5ecb74b24c72b64c8e7f3"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Call data synced successfully",
  "callLog": {
    "_id": "60d5ecb74b24c72b64c8e7f3",
    "status": "ended",
    "duration": 180,
    "cost": 0.45,
    "transcript": "Updated transcript...",
    "analysis": {
      "structuredData": {
        "patient_name": "John Doe Updated"
      }
    }
  }
}
```

### Analytics API

#### GET /api/analytics
Retrieve dashboard analytics and metrics.

**Response:**
```json
{
  "totalCalls": 156,
  "totalPatients": 89,
  "successfulCalls": 142,
  "totalCost": 67.89,
  "avgDuration": 165.4,
  "recentCalls": [
    {
      "_id": "60d5ecb74b24c72b64c8e7f3",
      "status": "ended",
      "duration": 180,
      "cost": 0.45,
      "createdAt": "2023-06-25T11:00:00.000Z",
      "patient": {
        "name": "John Doe",
        "phone": "+1234567890"
      }
    }
  ]
}
```

### VAPI Webhook

#### POST /api/vapi/webhook
Handles VAPI webhook events for real-time call updates.

**Webhook Event Types:**
- `end-of-call-report`: Call completion with full data
- `status-update`: Call status changes
- `transcript`: Real-time transcript updates
- `function-call`: Custom function executions

**Sample Webhook Payload:**
```json
{
  "message": {
    "type": "end-of-call-report",
    "call": {
      "id": "vapi_call_123",
      "status": "ended",
      "duration": 180,
      "cost": 0.45,
      "transcript": "Full conversation transcript...",
      "summary": "Call summary...",
      "recordingUrl": "https://recordings.vapi.ai/call_123.mp3"
    },
    "analysis": {
      "structuredData": {
        "patient_name": "John Doe",
        "patient_phone": "+1234567890",
        "insurance": "Blue Cross Blue Shield",
        "is_pregnant": "no",
        "income": "45000",
        "is_us_citizen": "yes"
      }
    },
    "costBreakdown": {
      "transport": 0.15,
      "stt": 0.10,
      "llm": 0.12,
      "tts": 0.08,
      "total": 0.45
    }
  }
}
```

## 📊 Structured Data Collection

The system automatically extracts and maps the following patient information from AI voice calls:

### Personal Information
- `patient_name`: Full name
- `patient_phone`: Phone number
- `email`: Email address
- `address`: Complete address
- `date_of_birth`: Date of birth
- `mrn`: Medical Record Number

### Medical & Financial
- `insurance`: Insurance provider name
- `is_pregnant`: Pregnancy status (yes/no/unsure)
- `income`: Annual income
- `is_us_citizen`: US citizenship status (yes/no)
- `is_asylee_or_refugee`: Asylee/refugee status (yes/no)

### Family Information
- `family_member_name`: Family member name
- `relationship`: Relationship to patient
- `family_member_dob`: Family member date of birth
- `family_member_income`: Family member income

## 🔍 Monitoring & Logging

### Webhook Logs
View webhook logs via API:
```bash
# Get today's webhook logs
GET /api/vapi/webhook?action=logs

# Get specific date logs
GET /api/vapi/webhook?action=logs&date=2023-06-25&limit=100

# Get error logs
GET /api/vapi/webhook?action=logs&type=errors&date=2023-06-25
```

### Health Check
```bash
# Check webhook endpoint health
GET /api/vapi/webhook?action=health

# Test database connection
GET /api/db-test
```

## 🚀 Deployment

### Environment Variables for Production
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/voice-ai
VAPI_API_KEY=your_production_vapi_key
VAPI_ASSISTANT_ID=your_production_assistant_id
VAPI_PHONE_NUMBER_ID=your_production_phone_id
VAPI_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add MONGODB_URI
vercel env add VAPI_API_KEY
# ... add other variables
```

### Docker Deployment
```bash
# Build Docker image
docker build -t voice-ai .

# Run with environment variables
docker run -p 3000:3000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e VAPI_API_KEY=your_vapi_key \
  voice-ai
```

## 🛠️ Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Database Models

**Patient Model:**
```typescript
interface Patient {
  name: string;
  phone: string;
  email?: string;
  mrn?: string;
  address?: Address;
  dateOfBirth?: Date;
  insurance?: Insurance;
  pregnancyStatus?: 'pregnant' | 'not_pregnant' | 'unknown';
  income?: Income;
  familyMembers?: FamilyMember[];
  usCitizenshipStatus?: 'citizen' | 'permanent_resident' | 'non_resident';
  asyleeRefugeeStatus?: 'asylee' | 'refugee' | 'protected_status' | 'neither';
  status: 'active' | 'inactive' | 'pending';
  notes?: string;
}
```

**CallLog Model:**
```typescript
interface CallLog {
  patientId: ObjectId;
  vapiCallId?: string;
  phoneNumber: string;
  status: 'queued' | 'ringing' | 'in-progress' | 'ended' | 'failed';
  duration?: number;
  cost?: number;
  startedAt?: Date;
  endedAt?: Date;
  transcript?: string;
  summary?: string;
  recordingUrl?: string;
  costBreakdown?: CostBreakdown;
  analysis?: Analysis;
  metadata?: Record<string, unknown>;
}
```

## 🔐 Security

- All API endpoints validate input data
- VAPI webhook signature verification
- Environment variables for sensitive data
- MongoDB connection with authentication
- CORS configuration for production

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Fails**
   ```bash
   # Test connection
   curl http://localhost:3000/api/db-test
   ```

2. **VAPI Webhook Not Receiving Events**
   - Verify webhook URL in VAPI dashboard
   - Check webhook secret configuration
   - Monitor logs: `GET /api/vapi/webhook?action=logs`

3. **Call Initiation Fails**
   - Verify VAPI credentials in environment
   - Check patient phone number format
   - Ensure VAPI assistant and phone number are configured

## 📧 Support

For issues and questions:
- Check the logs directory for detailed webhook logs
- Use the built-in health check endpoints
- Monitor call status in the dashboard

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [@anuragjatofficial](https://github.com/anuragjatofficial)