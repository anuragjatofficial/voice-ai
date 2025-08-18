import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('=== Database Connection Test ===');
    console.log('MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/voice-ai');
    
    // Test connection
    console.log('Attempting to connect...');
    await connectToDatabase(); // Fixed: Added parentheses
    console.log('Connection successful!');
    
    // Test database state
    const connectionState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    console.log('Connection state:', states[connectionState as keyof typeof states]);
    console.log('Database name:', mongoose.connection.name);
    
    // Test basic query
    const collections = await mongoose.connection.db?.listCollections().toArray();
    console.log('Available collections:', collections?.map(c => c.name));
    
    return NextResponse.json({
      status: 'success',
      connectionState: states[connectionState as keyof typeof states],
      databaseName: mongoose.connection.name,
      collections: collections?.map(c => c.name) || [],
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/voice-ai'
    });
    
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}