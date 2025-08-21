import mongoose from 'mongoose';

// Patient Schema with comprehensive demographic details
const PatientSchema = new mongoose.Schema({
  // Basic Information (existing)
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  
  // Medical Record Number (required)
  mrn: { type: String, required: true, unique: true },
  
  // Demographics
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String }
  },
  
  dateOfBirth: { type: Date },
  
  // Insurance Information
  insurance: {
    provider: { type: String },
    policyNumber: { type: String },
    groupNumber: { type: String },
    memberName: { type: String },
    relationshipToPolicyHolder: { type: String }
  },
  
  // Health Information
  pregnancyStatus: { 
    type: String, 
    enum: ['pregnant', 'not_pregnant', 'unknown', 'not_applicable'],
    default: 'unknown'
  },
  
  // Financial Information
  income: {
    annualIncome: { type: Number },
    currency: { type: String, default: 'USD' },
    verified: { type: Boolean, default: false }
  },
  
  // Family Member Information
  familyMembers: [{
    name: { type: String },
    relationship: { 
      type: String,
      enum: ['spouse', 'child', 'parent', 'sibling', 'guardian', 'other']
    },
    dateOfBirth: { type: Date },
    income: {
      annualIncome: { type: Number },
      currency: { type: String, default: 'USD' }
    }
  }],
  
  // Legal Status
  usCitizenshipStatus: { 
    type: String, 
    enum: ['citizen', 'permanent_resident', 'temporary_resident', 'visitor', 'undocumented', 'unknown'],
    default: 'unknown'
  },
  
  asyleeRefugeeStatus: { 
    type: String, 
    enum: ['asylee', 'refugee', 'neither', 'pending', 'unknown'],
    default: 'unknown'
  },
  
  // System fields (existing)
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'pending', 'completed'], 
    default: 'active' 
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
PatientSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Export the Patient model
export const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);