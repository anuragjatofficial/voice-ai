/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect, Schema, model, disconnect } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function debugCallLogs() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    await connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    
    // Get the CallLog model
    const CallLogSchema = new Schema({}, { strict: false, collection: 'calllogs' });
    const CallLog = model('CallLog', CallLogSchema);
    
    console.log('\n📊 Recent call logs:');
    const recentCalls = await CallLog.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    recentCalls.forEach((call: any, index) => {
      console.log(`\n${index + 1}. Call Log ID: ${call._id}`);
      console.log(`   VAPI Call ID: ${call.vapiCallId || 'NOT SET'}`);
      console.log(`   Patient ID: ${call.patientId || 'NOT SET'}`);
      console.log(`   Status: ${call.status || 'NOT SET'}`);
      console.log(`   Created: ${call.createdAt || 'NOT SET'}`);
      console.log(`   Duration: ${call.duration || 'NOT SET'} seconds`);
      console.log(`   Cost: $${call.cost || 'NOT SET'}`);
    });
    
    // Find calls without VAPI call IDs
    const callsWithoutVapiId = await CallLog.find({ 
      $or: [
        { vapiCallId: { $exists: false } },
        { vapiCallId: null },
        { vapiCallId: '' }
      ]
    }).countDocuments();
    
    console.log(`\n⚠️  Calls without VAPI Call ID: ${callsWithoutVapiId}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

debugCallLogs();