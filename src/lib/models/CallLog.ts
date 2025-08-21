import mongoose from "mongoose";

const CallLogSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  vapiCallId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["queued", "ringing", "in-progress", "forwarding", "ended", "failed"],
    default: "queued",
  },
  duration: {
    type: Number, // in seconds
    default: 0,
  },
  startedAt: {
    type: Date,
  },
  endedAt: {
    type: Date,
  },
  cost: {
    type: Number,
    default: 0,
  },
  costBreakdown: {
    transport: { type: Number, default: 0 },
    stt: { type: Number, default: 0 },
    llm: { type: Number, default: 0 },
    tts: { type: Number, default: 0 },
    vapi: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  transcript: {
    type: String,
  },
  summary: {
    type: String,
  },
  recordingUrl: {
    type: String,
  },
  messages: [{
    role: {
      type: String,
      enum: ["assistant", "user", "system"],
    },
    message: String,
    time: Number,
  }],
  analysis: {
    successEvaluation: String,
    structuredData: mongoose.Schema.Types.Mixed,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  error: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.CallLog || mongoose.model("CallLog", CallLogSchema);