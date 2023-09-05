import mongoose from "mongoose";

const resetPassSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: parseInt(process.env.JWT_RESET_PASS_EXPIRES_IN, 10), // The document will be automatically deleted after 2 minutes of its creation time
    },
    isUsed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ResetPass", resetPassSchema);
