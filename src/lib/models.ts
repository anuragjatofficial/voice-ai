import mongoose from 'mongoose';

// Patient Schema
const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'pending', 'completed'], 
    default: 'active' 
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Call Log Schema
const CallLogSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  callStatus: { 
    type: String, 
    enum: ['initiated', 'ringing', 'answered', 'completed', 'failed', 'busy'], 
    default: 'initiated' 
  },
  duration: { type: Number }, // in seconds
  notes: { type: String },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
export const CallLog = mongoose.models.CallLog || mongoose.model('CallLog', CallLogSchema);