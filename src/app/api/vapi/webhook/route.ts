/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Patient } from "@/lib/models";
import CallLog from "@/lib/models/CallLog";
import crypto from "crypto";
import fs from "fs";
import path from "path";

// Type definitions for VAPI webhook based on actual data received
interface VapiWebhookMessage {
  type: 'end-of-call-report' | 'status-update' | 'transcript' | 'function-call';
  call?: VapiCall;
  transcript?: string;
  timestamp?: number;
  analysis?: VapiAnalysis;
  artifact?: VapiArtifact;
  startedAt?: string;
  endedAt?: string;
  endedReason?: string;
  cost?: number;
  costBreakdown?: VapiCostBreakdown;
  costs?: VapiCost[];
  durationMs?: number;
  durationSeconds?: number;
  durationMinutes?: number;
  summary?: string;
  messages?: VapiMessage[];
  recordingUrl?: string;
  stereoRecordingUrl?: string;
  phoneNumber?: VapiPhoneNumber;
  customer?: VapiCustomer;
  assistant?: VapiAssistant;
  [key: string]: unknown;
}

interface VapiCall {
  id: string;
  orgId?: string;
  createdAt?: string;
  updatedAt?: string;
  type?: string;
  status?: 'queued' | 'ringing' | 'in-progress' | 'forwarding' | 'ended' | 'failed';
  duration?: number;
  cost?: number;
  endedAt?: string;
  startedAt?: string;
  transcript?: string;
  summary?: string;
  recordingUrl?: string;
  costBreakdown?: VapiCostBreakdown;
  messages?: VapiMessage[];
  analysis?: VapiAnalysis;
  phoneNumberId?: string;
  assistantId?: string;
  customer?: VapiCustomer;
  monitor?: {
    listenUrl?: string;
    controlUrl?: string;
  };
  transport?: {
    provider?: string;
    callSid?: string;
    accountSid?: string;
  };
  phoneCallProvider?: string;
  phoneCallProviderId?: string;
  phoneCallTransport?: string;
}

interface VapiAnalysis {
  summary?: string;
  structuredData?: StructuredData;
  successEvaluation?: string;
}

interface VapiArtifact {
  messages?: VapiMessage[];
  messagesOpenAIFormatted?: Array<{
    role: string;
    content: string;
  }>;
  transcript?: string;
  recordingUrl?: string;
  stereoRecordingUrl?: string;
  logUrl?: string;
  recording?: {
    stereoUrl?: string;
    mono?: {
      combinedUrl?: string;
      assistantUrl?: string;
      customerUrl?: string;
    };
  };
  nodes?: unknown[];
  variables?: Record<string, unknown>;
  variableValues?: Record<string, unknown>;
  performanceMetrics?: {
    turnLatencies?: Array<{
      modelLatency: number;
      voiceLatency: number;
      transcriberLatency: number;
      endpointingLatency: number;
      turnLatency: number;
    }>;
    modelLatencyAverage?: number;
    voiceLatencyAverage?: number;
    transcriberLatencyAverage?: number;
    endpointingLatencyAverage?: number;
    turnLatencyAverage?: number;
  };
}

interface VapiMessage {
  role: 'assistant' | 'user' | 'system' | 'bot';
  message?: string;
  content?: string;
  time?: number;
  endTime?: number;
  secondsFromStart?: number;
  duration?: number;
  source?: string;
}

interface VapiCostBreakdown {
  stt?: number;
  llm?: number;
  tts?: number;
  vapi?: number;
  chat?: number;
  transport?: number;
  total?: number;
  llmPromptTokens?: number;
  llmCompletionTokens?: number;
  ttsCharacters?: number;
  voicemailDetectionCost?: number;
  knowledgeBaseCost?: number;
  analysisCostBreakdown?: {
    summary?: number;
    summaryPromptTokens?: number;
    summaryCompletionTokens?: number;
    structuredData?: number;
    structuredDataPromptTokens?: number;
    structuredDataCompletionTokens?: number;
    successEvaluation?: number;
    successEvaluationPromptTokens?: number;
    successEvaluationCompletionTokens?: number;
    structuredOutput?: number;
    structuredOutputPromptTokens?: number;
    structuredOutputCompletionTokens?: number;
  };
}

interface VapiCost {
  type: string;
  transcriber?: {
    provider: string;
    model: string;
  };
  model?: {
    provider: string;
    model: string;
  };
  voice?: {
    provider: string;
    voiceId: string;
    model: string;
  };
  minutes?: number;
  cost: number;
  promptTokens?: number;
  completionTokens?: number;
  characters?: number;
  subType?: string;
  analysisType?: string;
}

interface VapiPhoneNumber {
  id: string;
  orgId: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  twilioAccountSid?: string;
  name?: string;
  provider: string;
  status: string;
}

interface VapiCustomer {
  number: string;
  name?: string;
}

interface VapiAssistant {
  id: string;
  orgId: string;
  name: string;
  voice?: {
    voiceId: string;
    provider: string;
  };
  createdAt: string;
  updatedAt: string;
  model?: {
    model: string;
    messages?: Array<{
      role: string;
      content: string;
    }>;
    provider: string;
    temperature?: number;
  };
  firstMessage?: string;
  voicemailMessage?: string;
  endCallMessage?: string;
  transcriber?: {
    model: string;
    language: string;
    provider: string;
    endpointing?: number;
  };
  clientMessages?: string[];
  serverMessages?: string[];
  endCallPhrases?: string[];
  hipaaEnabled?: boolean;
  analysisPlan?: {
    structuredDataPlan?: {
      schema?: {
        type: string;
        properties: Record<string, {
          type: string;
          description: string;
        }>;
      };
      enabled?: boolean;
      messages?: Array<{
        role: string;
        content: string;
      }>;
    };
    minMessagesThreshold?: number;
  };
  backgroundDenoisingEnabled?: boolean;
  startSpeakingPlan?: {
    waitSeconds?: number;
    smartEndpointingEnabled?: string;
  };
  server?: {
    url: string;
    timeoutSeconds?: number;
  };
}

// Fixed structured data interface to handle tab characters and actual field names
interface StructuredData {
  patient_name?: string;
  patient_phone?: string;
  address?: string;
  email?: string;
  date_of_birth?: string;
  mrn?: string;
  insurance?: string;
  'is_pregnant\t'?: 'yes' | 'no' | 'unsure'; // Note the tab character
  is_pregnant?: 'yes' | 'no' | 'unsure'; // Also handle without tab
  income?: string;
  family_member_name?: string;
  'relationship\t'?: string; // Note the tab character
  relationship?: string; // Also handle without tab
  family_member_dob?: string;
  'family_member_income\t'?: string; // Note the tab character
  family_member_income?: string; // Also handle without tab
  'is_us_citizen\t'?: 'yes' | 'no'; // Note the tab character
  is_us_citizen?: 'yes' | 'no'; // Also handle without tab
  is_asylee_or_refugee?: 'yes' | 'no';
}

interface CallLogDocument {
  _id: string;
  patientId: string;
  vapiCallId?: string;
  status: string;
  duration?: number;
  cost?: number;
  startedAt?: Date;
  endedAt?: Date;
  transcript?: string;
  summary?: string;
  recordingUrl?: string;
  costBreakdown?: VapiCostBreakdown;
  messages?: VapiMessage[];
  analysis?: VapiAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

interface PatientDocument {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  dateOfBirth?: Date;
  mrn?: string;
  insurance?: {
    provider?: string;
    policyNumber?: string;
    groupNumber?: string;
  };
  pregnancyStatus?: 'pregnant' | 'not_pregnant' | 'unknown';
  income?: {
    annualIncome?: number;
    currency?: string;
    verified?: boolean;
  };
  usCitizenshipStatus?: 'citizen' | 'permanent_resident' | 'non_resident';
  asyleeRefugeeStatus?: 'asylee' | 'refugee' | 'protected_status' | 'neither';
  familyMembers?: Array<{
    name: string;
    relationship?: string;
    dateOfBirth?: Date;
    income?: {
      annualIncome: number;
      currency: string;
    };
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Comprehensive logging utility
class WebhookLogger {
  private static logDir = path.join(process.cwd(), 'logs');
  
  static async init(): Promise<void> {
    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create logs directory:', error);
    }
  }

  static async logWebhookEvent(
    eventType: string, 
    data: any, 
    headers: Record<string, string>, 
    processingResult?: any
  ): Promise<void> {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      eventType,
      headers: {
        'content-type': headers['content-type'] || '',
        'user-agent': headers['user-agent'] || '',
        'x-vapi-signature': headers['x-vapi-signature'] ? '[PRESENT]' : '[MISSING]',
        'content-length': headers['content-length'] || '',
        'x-call-id': headers['x-call-id'] || '',
        ...Object.fromEntries(
          Object.entries(headers).filter(([key]) => 
            key.toLowerCase().startsWith('x-') || 
            key.toLowerCase().includes('vapi')
          )
        )
      },
      payload: data,
      processingResult,
      rawDataSize: JSON.stringify(data).length
    };

    // Enhanced console logging
    console.log('\n' + '='.repeat(80));
    console.log(`🔔 VAPI WEBHOOK EVENT: ${eventType.toUpperCase()}`);
    console.log(`⏰ Timestamp: ${timestamp}`);
    console.log('='.repeat(80));
    
    // Log headers
    console.log('📋 HEADERS:');
    Object.entries(logEntry.headers).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    
    // Log key data points from the webhook
    if (data.message) {
      console.log('\n🔍 WEBHOOK MESSAGE DETAILS:');
      
      // Call information
      const call = data.message.call;
      if (call) {
        console.log(`   Call ID: ${call.id}`);
        console.log(`   Status: ${call.status || 'N/A'}`);
        console.log(`   Customer: ${call.customer?.name || 'N/A'} (${call.customer?.number || 'N/A'})`);
      }
      
      // Top-level event data
      console.log(`   Event Type: ${data.message.type}`);
      console.log(`   Started At: ${data.message.startedAt || 'N/A'}`);
      console.log(`   Ended At: ${data.message.endedAt || 'N/A'}`);
      console.log(`   Duration: ${data.message.durationSeconds || 'N/A'} seconds`);
      console.log(`   Cost: $${data.message.cost || 'N/A'}`);
      console.log(`   Ended Reason: ${data.message.endedReason || 'N/A'}`);
      
      // Analysis and structured data
      if (data.message.analysis?.structuredData) {
        console.log('\n📊 STRUCTURED DATA EXTRACTED:');
        Object.entries(data.message.analysis.structuredData).forEach(([key, value]) => {
          // Clean up field names with tabs
          const cleanKey = key.replace(/\t/g, '');
          console.log(`   ${cleanKey}: ${value || 'null'}`);
        });
      }
      
      // Cost breakdown
      if (data.message.costBreakdown) {
        console.log('\n💰 COST BREAKDOWN:');
        Object.entries(data.message.costBreakdown).forEach(([key, value]) => {
          console.log(`   ${key}: $${value}`);
        });
      }
      
      // Summary
      if (data.message.summary) {
        console.log('\n📝 CALL SUMMARY:');
        console.log(`   ${data.message.summary}`);
      }
      
      // Recording URLs
      if (data.message.recordingUrl) {
        console.log('\n🎵 RECORDING:');
        console.log(`   Mono: ${data.message.recordingUrl}`);
        if (data.message.stereoRecordingUrl) {
          console.log(`   Stereo: ${data.message.stereoRecordingUrl}`);
        }
      }
      
      // Messages summary
      if (data.message.messages && data.message.messages.length > 0) {
        console.log('\n💬 CONVERSATION SUMMARY:');
        console.log(`   Total messages: ${data.message.messages.length}`);
        console.log(`   First message: ${data.message.messages[0]?.message?.substring(0, 100) || 'N/A'}...`);
      }
    }
    
    if (processingResult) {
      console.log('\n⚙️ PROCESSING RESULT:');
      console.log(JSON.stringify(processingResult, null, 2));
    }
    
    console.log('='.repeat(80) + '\n');

    // File logging
    try {
      const logFileName = `vapi-webhook-${timestamp.split('T')[0]}.jsonl`;
      const logFilePath = path.join(this.logDir, logFileName);
      const logLine = JSON.stringify(logEntry) + '\n';
      
      fs.appendFileSync(logFilePath, logLine);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  static async logError(error: any, context: string, additionalData?: any): Promise<void> {
    const timestamp = new Date().toISOString();
    const errorLog = {
      timestamp,
      context,
      error: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      },
      additionalData
    };

    console.error('\n' + '❌'.repeat(20));
    console.error(`🚨 WEBHOOK ERROR in ${context}`);
    console.error(`⏰ Timestamp: ${timestamp}`);
    console.error('❌'.repeat(40));
    console.error('Error Details:', error);
    if (additionalData) {
      console.error('Additional Context:', JSON.stringify(additionalData, null, 2));
    }
    console.error('❌'.repeat(40) + '\n');

    // File logging for errors
    try {
      const errorFileName = `vapi-webhook-errors-${timestamp.split('T')[0]}.jsonl`;
      const errorFilePath = path.join(this.logDir, errorFileName);
      const errorLine = JSON.stringify(errorLog) + '\n';
      
      fs.appendFileSync(errorFilePath, errorLine);
    } catch (logError) {
      console.error('Failed to write error to log file:', logError);
    }
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let requestData: any = null;
  let headers: Record<string, string> = {};
  
  try {
    await WebhookLogger.init();
    
    // Capture all headers
    headers = Object.fromEntries(request.headers.entries());
    
    // Get the raw body for signature verification
    const body = await request.text();
    
    // Parse the JSON data
    requestData = JSON.parse(body);
    
    // Log the incoming webhook immediately
    await WebhookLogger.logWebhookEvent(
      requestData.message?.type || 'unknown',
      requestData,
      headers
    );
    
    await connectDB();
    
    // Verify webhook signature if secret is configured
    const signature = request.headers.get('x-vapi-signature');
    if (process.env.VAPI_WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.VAPI_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        await WebhookLogger.logError(
          new Error('Invalid webhook signature'),
          'Signature Verification',
          { providedSignature: signature, expectedLength: expectedSignature.length }
        );
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const { message } = requestData;

    if (!message?.type) {
      console.log('No message type provided');
      return NextResponse.json({ success: true });
    }

    let processingResult: any = null;

    // Handle different message types
    switch (message.type) {
      case 'end-of-call-report':
        processingResult = await handleCallEnd(message);
        break;
      
      case 'status-update':
        processingResult = await handleStatusUpdate(message);
        break;
        
      case 'transcript':
        processingResult = await handleTranscript(message);
        break;
        
      case 'function-call':
        processingResult = await handleFunctionCall(message);
        break;
        
      default:
        console.log('Unhandled webhook message type:', message.type);
        processingResult = { success: true, message: 'Unhandled message type' };
    }

    // Log the processing result
    await WebhookLogger.logWebhookEvent(
      `${message.type}-processed`,
      requestData,
      headers,
      processingResult
    );

    return NextResponse.json(processingResult);

  } catch (error) {
    await WebhookLogger.logError(
      error,
      'Webhook Processing',
      {
        requestData,
        headers,
        url: request.url,
        method: request.method
      }
    );
    
    console.error("VAPI Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification and log viewing
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (!action || action === 'health') {
      return NextResponse.json({ 
        message: "VAPI Webhook endpoint is active",
        timestamp: new Date().toISOString(),
        status: "healthy"
      });
    }
    
    if (action === 'logs') {
      const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
      const type = searchParams.get('type') || 'webhook';
      const limit = parseInt(searchParams.get('limit') || '50');
      
      const logDir = path.join(process.cwd(), 'logs');
      const fileName = type === 'errors' 
        ? `vapi-webhook-errors-${date}.jsonl`
        : `vapi-webhook-${date}.jsonl`;
      const filePath = path.join(logDir, fileName);
      
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({
          success: false,
          message: `No logs found for date: ${date}`,
          availableFiles: fs.existsSync(logDir) ? fs.readdirSync(logDir).filter(f => f.includes('vapi-webhook')) : []
        });
      }
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.trim().split('\n').filter(line => line.trim());
      const logs = lines.slice(-limit).map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return { 
            timestamp: new Date().toISOString(),
            eventType: 'parse-error',
            headers: {},
            payload: {},
            rawDataSize: line.length,
            rawLine: line, 
            parseError: true 
          };
        }
      });
      
      return NextResponse.json({
        success: true,
        date,
        type,
        totalLines: lines.length,
        logsReturned: logs.length,
        logs: logs.reverse()
      });
    }
    
    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
    
  } catch (error) {
    console.error('Error handling GET request:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process request'
    }, { status: 500 });
  }
}

async function handleCallEnd(message: VapiWebhookMessage): Promise<any> {
  try {
    console.log('🔚 Processing call end event...');
    
    // The call ID is now in the message.call.id or extract from headers
    const callId = message.call?.id || message.artifact?.recording?.mono?.combinedUrl?.match(/([a-f0-9-]{36})/)?.[0];
    
    if (!callId) {
      const error = 'No call ID found in end-of-call-report';
      console.error('❌', error);
      return { success: false, error };
    }

    console.log(`📞 Processing end-of-call for VAPI call: ${callId}`);

    // Find the call log by VAPI call ID
    const callLog = await CallLog.findOne({ vapiCallId: callId }).lean() as CallLogDocument | null;
    
    if (!callLog) {
      const error = `Call log not found for VAPI call ID: ${callId}`;
      console.error('❌', error);
      console.log('🔍 Available call logs:');
      const recentCalls = await CallLog.find({}).sort({ createdAt: -1 }).limit(5).select('vapiCallId _id createdAt').lean();
      recentCalls.forEach(call => {
        console.log(`   ${call._id} -> ${call.vapiCallId} (${call.createdAt})`);
      });
      return { success: false, error };
    }

    console.log(`✅ Found call log: ${callLog._id}`);

    // Update call log with comprehensive end data
    const callLogResult = await updateCallLogFromWebhook(callLog, message);
    console.log('📝 Call log update result:', callLogResult);

    // Extract and update patient data if structured data is available
    let patientUpdateResult = null;
    if (message.analysis?.structuredData) {
      console.log('📊 Structured data found, updating patient...');
      patientUpdateResult = await updatePatientFromStructuredData(callLog.patientId, message.analysis.structuredData);
      console.log('👤 Patient update result:', patientUpdateResult);
    } else {
      console.log('ℹ️ No structured data in call analysis');
    }

    return { 
      success: true, 
      message: "Call end processed successfully",
      callLogId: callLog._id,
      callId: callId,
      updates: {
        callLog: callLogResult,
        patient: patientUpdateResult || undefined
      }
    };

  } catch (error) {
    await WebhookLogger.logError(error, 'handleCallEnd', { message });
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function updateCallLogFromWebhook(callLog: CallLogDocument, message: VapiWebhookMessage): Promise<any> {
  try {
    const updateData: Partial<CallLogDocument> = {
      status: 'ended', // Call has ended
      updatedAt: new Date(),
    };

    // Map data from the webhook message structure
    if (message.durationSeconds !== undefined) {
      updateData.duration = message.durationSeconds;
    }
    
    if (message.cost !== undefined) {
      updateData.cost = message.cost;
    }
    
    if (message.endedAt) {
      updateData.endedAt = new Date(message.endedAt);
    }
    
    if (message.startedAt && !callLog.startedAt) {
      updateData.startedAt = new Date(message.startedAt);
    }
    
    if (message.transcript) {
      updateData.transcript = message.transcript;
    }
    
    if (message.summary) {
      updateData.summary = message.summary;
    }
    
    if (message.recordingUrl) {
      updateData.recordingUrl = message.recordingUrl;
    }
    
    // Update cost breakdown if available
    if (message.costBreakdown) {
      updateData.costBreakdown = {
        transport: message.costBreakdown.transport || 0,
        stt: message.costBreakdown.stt || 0,
        llm: message.costBreakdown.llm || 0,
        tts: message.costBreakdown.tts || 0,
        vapi: message.costBreakdown.vapi || 0,
        total: message.costBreakdown.total || message.cost || 0,
      };
    }
    
    // Update messages if available
    if (message.messages && Array.isArray(message.messages)) {
      updateData.messages = message.messages;
    }
    
    // Update analysis data
    if (message.analysis) {
      updateData.analysis = {
        successEvaluation: message.analysis.successEvaluation,
        structuredData: message.analysis.structuredData,
      };
    }

    const result = await CallLog.findByIdAndUpdate(callLog._id, updateData, { new: true });
    console.log('✅ Call log updated successfully:', callLog._id);
    
    return {
      updated: true,
      callLogId: callLog._id,
      fieldsUpdated: Object.keys(updateData),
      newStatus: updateData.status,
      duration: updateData.duration,
      cost: updateData.cost
    };
  } catch (error) {
    console.error('Error updating call log:', error);
    throw error;
  }
}

async function updatePatientFromStructuredData(patientId: string, structuredData: StructuredData): Promise<any> {
  try {
    console.log('🔄 Updating patient with structured data...');
    console.log('📊 Raw structured data received:', JSON.stringify(structuredData, null, 2));

    const patient = await Patient.findById(patientId).lean() as PatientDocument | null;
    if (!patient) {
      const error = `Patient not found for ID: ${patientId}`;
      console.error('❌', error);
      return { success: false, error, patientId, fieldsProcessed: [], structuredDataReceived: Object.keys(structuredData) };
    }

    console.log(`👤 Found patient: ${patient.name} (${patient._id})`);

    // Helper function to get field value, handling tab characters
    const getFieldValue = (key: string): string | undefined => {
      return structuredData[key as keyof StructuredData] || 
             structuredData[`${key}\t` as keyof StructuredData] || 
             undefined;
    };

    // Prepare update object - only update fields that have values
    const updateData: Partial<PatientDocument> = {
      updatedAt: new Date()
    };

    const fieldsProcessed: string[] = [];

    // Map VAPI structured data to patient fields (handling tab characters)
    const patientName = getFieldValue('patient_name');
    if (patientName?.trim()) {
      updateData.name = patientName.trim();
      fieldsProcessed.push('name');
    }

    const patientPhone = getFieldValue('patient_phone');
    if (patientPhone?.trim()) {
      updateData.phone = patientPhone.trim();
      fieldsProcessed.push('phone');
    }

    const email = getFieldValue('email');
    if (email?.trim()) {
      updateData.email = email.trim();
      fieldsProcessed.push('email');
    }

    const address = getFieldValue('address');
    if (address?.trim()) {
      updateData.address = {
        ...patient.address,
        street: address.trim()
      };
      fieldsProcessed.push('address');
    }

    const dateOfBirth = getFieldValue('date_of_birth');
    if (dateOfBirth) {
      try {
        // Handle the format "23 11 2004" or "23/11/2004" etc.
        let dateStr = dateOfBirth.trim();
        
        // Convert "23 11 2004" to "2004-11-23"
        if (/^\d{1,2}\s+\d{1,2}\s+\d{4}$/.test(dateStr)) {
          const parts = dateStr.split(/\s+/);
          dateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) {
          updateData.dateOfBirth = parsedDate;
          fieldsProcessed.push('dateOfBirth');
          console.log(`✅ Parsed date of birth: ${dateOfBirth} -> ${parsedDate.toISOString()}`);
        } else {
          console.error('❌ Could not parse date:', dateOfBirth);
        }
      } catch (error) {
        console.error('❌ Invalid date_of_birth format:', dateOfBirth, error);
      }
    }

    const mrn = getFieldValue('mrn');
    if (mrn?.trim()) {
      updateData.mrn = mrn.trim();
      fieldsProcessed.push('mrn');
    }

    // Insurance information
    const insurance = getFieldValue('insurance');
    if (insurance?.trim() && insurance.toLowerCase() !== 'no') {
      updateData.insurance = {
        ...patient.insurance,
        provider: insurance.trim()
      };
      fieldsProcessed.push('insurance');
    }

    // Pregnancy status
    const isPregnant = getFieldValue('is_pregnant');
    if (isPregnant) {
      const pregnancyValue = isPregnant.toLowerCase();
      if (pregnancyValue === 'yes') {
        updateData.pregnancyStatus = 'pregnant';
      } else if (pregnancyValue === 'no') {
        updateData.pregnancyStatus = 'not_pregnant';
      } else {
        updateData.pregnancyStatus = 'unknown';
      }
      fieldsProcessed.push('pregnancyStatus');
    }

    // Income information
    const income = getFieldValue('income');
    if (income) {
      const incomeValue = parseFloat(income);
      if (!isNaN(incomeValue) && incomeValue > 0) {
        updateData.income = {
          ...patient.income,
          annualIncome: incomeValue,
          currency: 'USD',
          verified: true
        };
        fieldsProcessed.push('income');
      }
    }

    // US Citizenship
    const isUsCitizen = getFieldValue('is_us_citizen');
    if (isUsCitizen) {
      const citizenshipValue = isUsCitizen.toLowerCase();
      if (citizenshipValue === 'yes') {
        updateData.usCitizenshipStatus = 'citizen';
      } else if (citizenshipValue === 'no') {
        updateData.usCitizenshipStatus = 'non_resident';
      }
      fieldsProcessed.push('usCitizenshipStatus');
    }

    // Asylee/Refugee status
    const isAsyleeOrRefugee = getFieldValue('is_asylee_or_refugee');
    if (isAsyleeOrRefugee) {
      const asyleeValue = isAsyleeOrRefugee.toLowerCase();
      if (asyleeValue === 'yes') {
        updateData.asyleeRefugeeStatus = 'asylee';
      } else if (asyleeValue === 'no') {
        updateData.asyleeRefugeeStatus = 'neither';
      }
      fieldsProcessed.push('asyleeRefugeeStatus');
    }

    // Family member information
    const familyMemberName = getFieldValue('family_member_name');
    if (familyMemberName?.trim()) {
      const familyMember: NonNullable<PatientDocument['familyMembers']>[number] = {
        name: familyMemberName.trim()
      };

      const relationship = getFieldValue('relationship');
      if (relationship?.trim()) {
        familyMember.relationship = relationship.toLowerCase().trim();
      }

      const familyMemberDob = getFieldValue('family_member_dob');
      if (familyMemberDob) {
        try {
          const parsedDate = new Date(familyMemberDob);
          if (!isNaN(parsedDate.getTime())) {
            familyMember.dateOfBirth = parsedDate;
          }
        } catch (error) {
          console.error('❌ Invalid family_member_dob format:', familyMemberDob);
        }
      }

      const familyMemberIncome = getFieldValue('family_member_income');
      if (familyMemberIncome) {
        const familyIncome = parseFloat(familyMemberIncome);
        if (!isNaN(familyIncome) && familyIncome > 0) {
          familyMember.income = {
            annualIncome: familyIncome,
            currency: 'USD'
          };
        }
      }

      // Add to family members array (avoid duplicates by name)
      const existingFamilyMembers = patient.familyMembers || [];
      const existingMemberIndex = existingFamilyMembers.findIndex(
        (member) => member.name.toLowerCase() === familyMember.name.toLowerCase()
      );

      if (existingMemberIndex === -1) {
        updateData.familyMembers = [...existingFamilyMembers, familyMember];
      } else {
        const updatedFamilyMembers = [...existingFamilyMembers];
        updatedFamilyMembers[existingMemberIndex] = {
          ...updatedFamilyMembers[existingMemberIndex],
          ...familyMember
        };
        updateData.familyMembers = updatedFamilyMembers;
      }
      fieldsProcessed.push('familyMembers');
    }

    // Only update if we have data to update (more than just updatedAt)
    const fieldsToUpdate = Object.keys(updateData).filter(key => key !== 'updatedAt');
    
    if (fieldsToUpdate.length > 0) {
      const updatedPatient = await Patient.findByIdAndUpdate(patientId, updateData, { 
        new: true, 
        runValidators: true 
      }).lean() as unknown as PatientDocument;
      
      console.log('✅ Patient updated successfully:', patientId);
      console.log('📝 Updated fields:', fieldsToUpdate);
      
      return {
        success: true,
        patientId,
        patientName: patient.name,
        fieldsUpdated: fieldsToUpdate,
        fieldsProcessed,
        structuredDataReceived: Object.keys(structuredData),
        updatedPatient: {
          id: updatedPatient._id,
          name: updatedPatient.name,
          phone: updatedPatient.phone
        }
      };
    } else {
      console.log('ℹ️ No valid structured data to update for patient:', patientId);
      return {
        success: false,
        reason: 'No valid data to update',
        patientId,
        fieldsProcessed,
        structuredDataReceived: Object.keys(structuredData)
      };
    }

  } catch (error) {
    await WebhookLogger.logError(error, 'updatePatientFromStructuredData', { patientId, structuredData });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      patientId,
      fieldsProcessed: [],
      structuredDataReceived: Object.keys(structuredData),
      structuredData
    };
  }
}

async function handleStatusUpdate(message: VapiWebhookMessage): Promise<any> {
  try {
    console.log('📊 Processing status update...');
    
    const callId = message.call?.id;
    if (!callId) {
      return { success: true };
    }

    const callLog = await CallLog.findOne({ vapiCallId: callId }).lean() as CallLogDocument | null;
    if (!callLog) {
      console.log(`ℹ️ Call log not found for status update: ${callId}`);
      return { success: true };
    }

    const updateData: Partial<CallLogDocument> = {
      status: message.call?.status || 'unknown',
      updatedAt: new Date()
    };

    if (message.startedAt && !callLog.startedAt) {
      updateData.startedAt = new Date(message.startedAt);
    }

    await CallLog.findByIdAndUpdate(callLog._id, updateData);
    console.log(`✅ Call status updated: ${callId} -> ${message.call?.status}`);
    
    return { 
      success: true, 
      callId: callId, 
      newStatus: message.call?.status,
      callLogId: callLog._id 
    };

  } catch (error) {
    await WebhookLogger.logError(error, 'handleStatusUpdate', { message });
    return { success: true };
  }
}

async function handleTranscript(message: VapiWebhookMessage): Promise<any> {
  try {
    console.log('📝 Processing transcript update...');
    
    const callId = message.call?.id;
    if (!callId) {
      return { success: true };
    }

    const callLog = await CallLog.findOne({ vapiCallId: callId }).lean() as CallLogDocument | null;
    if (!callLog) {
      console.log(`ℹ️ Call log not found for transcript update: ${callId}`);
      return { success: true };
    }

    const updateData: Partial<CallLogDocument> = {
      transcript: message.call?.transcript || message.transcript,
      updatedAt: new Date()
    };

    await CallLog.findByIdAndUpdate(callLog._id, updateData);
    console.log(`✅ Transcript updated for call: ${callId}`);
    
    return { 
      success: true, 
      callId: callId,
      callLogId: callLog._id,
      transcriptLength: (message.call?.transcript || message.transcript || '').length,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    await WebhookLogger.logError(error, 'handleTranscript', { message });
    return { success: true };
  }
}

async function handleFunctionCall(message: VapiWebhookMessage): Promise<any> {
  try {
    console.log('🔧 Processing function call...');
    
    const callId = message.call?.id;
    if (!callId) {
      return { success: true };
    }

    console.log(`📞 Function call received for VAPI call: ${callId}`);
    
    return { 
      success: true, 
      callId: callId,
      message: 'Function call acknowledged',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    await WebhookLogger.logError(error, 'handleFunctionCall', { message });
    return { success: true };
  }
}
