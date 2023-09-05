import "dotenv/config";
import mongoose from "mongoose";
const otpSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: parseInt(process.env.JWT_OTP_EXPIRES_IN, 10), // The document will be automatically deleted after 2 minutes of its creation time
    },
    isUsed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Otp", otpSchema);
