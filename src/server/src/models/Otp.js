const mongoose = require('mongoose');

// Stored in MongoDB (not PostgreSQL) because OTPs are short-lived, schema-free,
// and benefit from MongoDB's native TTL index for automatic expiry cleanup.
const otpSchema = new mongoose.Schema({
  email:     { type: String, required: true, lowercase: true, trim: true },
  otp:       { type: String, required: true },
  expiresAt: { type: Date,   required: true },
  used:      { type: Boolean, default: false },
  createdAt: { type: Date,   default: Date.now },
});

// MongoDB will automatically delete documents once expiresAt is reached.
// expireAfterSeconds: 0 means "delete exactly at the expiresAt timestamp".
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpModel = mongoose.model('Otp', otpSchema);

module.exports = OtpModel;
