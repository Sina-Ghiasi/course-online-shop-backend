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
      expires: 120, // The document will be automatically deleted after 2 minutes of its creation time
    },
    isUsed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Otp", otpSchema);
