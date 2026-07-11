import User from "../models/userSchema.js";
import DailySummary from "../models/dailySummarySchema.js";

export const getDailySummary = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get today's start and end times
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    // Find today's food summary
    const summary = await DailySummary.findOne({
      userId: user._id,
      date: { $gte: start, $lte: end },
    });

    // If no summary yet (maybe user hasn’t logged food)
    if (!summary) {
      return res.json({
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        dailyCalories: user.dailyNutritionTarget?.calories || 0,
        dailyProtein: user.dailyNutritionTarget?.protein || 0,
        dailyCarbs: user.dailyNutritionTarget?.carbs || 0,
        dailyFat: user.dailyNutritionTarget?.fat || 0,
      });
    }

    // Combine summary totals + user targets
    res.json({
      totalCalories: summary.totalCalories,
      totalProtein: summary.totalProtein,
      totalCarbs: summary.totalCarbs,
      totalFat: summary.totalFat,
      dailyCalories: user.dailyNutritionTarget?.calories || 0,
      dailyProtein: user.dailyNutritionTarget?.protein || 0,
      dailyCarbs: user.dailyNutritionTarget?.carbs || 0,
      dailyFat: user.dailyNutritionTarget?.fat || 0,
    });
  } catch (error) {
    console.error("Error fetching daily summary:", error);
    res.status(500).json({ message: "Server error" });
  }
};
