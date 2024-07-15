const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  lastResend: { type: Date, default: Date.now },
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
