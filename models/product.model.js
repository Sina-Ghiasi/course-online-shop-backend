import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    summary: { type: String },
    description: { type: String },
    image: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    spotPlayerId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
