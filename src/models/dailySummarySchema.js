import mongoose from "mongoose";

  const dailySummarySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true, index: true },
    totalCalories: { type: Number, required: true, default: 0 },
    totalProtein: { type: Number, required: true, default: 0 },
    totalCarbs: { type: Number, required: true, default: 0 },
    totalFat: { type: Number, required: true, default: 0 },
  }, { timestamps: true });

export default mongoose.model("DailySummary", dailySummarySchema);
