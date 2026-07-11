import mongoose from "mongoose";

const dailyNutritionTargetSchema = new mongoose.Schema({
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
}, { _id: false }); // prevent creating a separate _id for subdocument

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true }, // store Firebase UID
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  photoURL: { type: String }, // from Google profile
  age: { type: Number, min: 1 },
  gender: { type: String, enum: ["male", "female", "other"] },
  height: { type: Number }, // in cm
  weight: { type: Number }, // in kg
  goal: { type: String, enum: ["weight_loss", "muscle_gain", "maintenance"] },
  activityLevel: { type: String, enum: ["sedentary", "light", "moderate", "active"] },
  dailyNutritionTarget: dailyNutritionTargetSchema,
}, { timestamps: true });

export default mongoose.model("User", userSchema);
