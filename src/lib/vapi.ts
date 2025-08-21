import { VapiClient } from '@vapi-ai/server-sdk';

const vapi = new VapiClient({
  token: process.env.VAPI_API_KEY!,
});

export interface VapiCallRequest {
  phoneNumberId: string;
  assistantId: string;
  customer: {
    number: string;
    name?: string;
  };
  metadata?: Record<string, unknown>;
}

export interface VapiCall {
  id: string;
  status: 'queued' | 'ringing' | 'in-progress' | 'forwarding' | 'ended';
  phoneNumberId: string;
  assistantId: string;
  customer: {
    number: string;
    name?: string;
  };
  startedAt?: string;
  endedAt?: string;
  cost?: number;
  costBreakdown?: {
    transport: number;
    stt: number;
    llm: number;
    tts: number;
    vapi: number;
    total: number;
  };
  messages?: Array<{
    role: 'assistant' | 'user' | 'system';
    message: string;
    time: number;
  }>;
  recordingUrl?: string;
  transcript?: string;
  summary?: string;
  analysis?: {
    successEvaluation?: string;
    structuredData?: Record<string, unknown>;
  };
}

export class VapiService {
  static async createCall(request: VapiCallRequest): Promise<VapiCall> {
    try {
      const call = await vapi.calls.create({
        phoneNumberId: request.phoneNumberId,
        assistantId: request.assistantId,
        customer: request.customer,
      });
      
      return call as VapiCall;
    } catch (error) {
      console.error('Error creating VAPI call:', error);
      throw new Error('Failed to create call');
    }
  }

  static async getCall(callId: string): Promise<VapiCall> {
    try {
      const call = await vapi.calls.get(callId);
      return call as VapiCall;
    } catch (error) {
      console.error('Error fetching VAPI call:', error);
      throw new Error('Failed to fetch call');
    }
  }

  static async listCalls(limit = 100): Promise<VapiCall[]> {
    try {
      const calls = await vapi.calls.list({ limit });
      return calls as VapiCall[];
    } catch (error) {
      console.error('Error listing VAPI calls:', error);
      throw new Error('Failed to list calls');
    }
  }

  static async createAssistant(config: Record<string, unknown>) {
    try {
      const assistant = await vapi.assistants.create(config);
      return assistant;
    } catch (error) {
      console.error('Error creating VAPI assistant:', error);
      throw new Error('Failed to create assistant');
    }
  }

  static async getAssistant(assistantId: string) {
    try {
      const assistant = await vapi.assistants.get(assistantId);
      return assistant;
    } catch (error) {
      console.error('Error fetching VAPI assistant:', error);
      throw new Error('Failed to fetch assistant');
    }
  }
}

export default VapiService;