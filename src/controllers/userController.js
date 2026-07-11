import User from "../models/userSchema.js";
import { calculateNutrition } from "../utils/calculateNutrition.js";

// Save or update user nutrition data
export const saveNutritionData = async (req, res) => {
  try {
    const uid = req.user.uid; // From Firebase Auth middleware

    const {
      name,
      email,
      photoURL,
      age,
      gender,
      height,
      weight,
      goal,
      activityLevel,
    } = req.body;

    // 🔹 Calculate nutrition requirement
    console.log("Incoming user data:", {
      age,
      weight,
      height,
      gender,
      goal,
      activityLevel,
    });

    const dailyNutritionTarget = calculateNutrition({
      age,
      gender,
      height,
      weight,
      goal,
      activityLevel,
    });

    // 🔹 Create or update user in MongoDB
    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      {
        firebaseUid: uid,
        name,
        email,
        photoURL,
        age,
        gender,
        height,
        weight,
        goal,
        activityLevel,
        dailyNutritionTarget,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Nutrition data saved successfully",
      user,
    });
  } catch (error) {
    console.error("Error saving nutrition data:", error);
    res.status(500).json({ message: "Server error" });
  }
};
