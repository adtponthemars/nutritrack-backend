import mongoose from "mongoose";

const nutrientsSchema = new mongoose.Schema({
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
}, { _id: false });

const foodLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  mealType: { type: String, enum: ["breakfast", "lunch", "dinner", "snack"], required: true },
  foodId:  { type: String },
  foodName: { type: String, required: true },   
  quantity: { type: Number, required: true },
  nutrients: { type: nutrientsSchema, required: true }
}, { timestamps: true });

export default mongoose.model("FoodLog", foodLogSchema);
