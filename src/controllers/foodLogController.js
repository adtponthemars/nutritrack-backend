import FoodLog from "../models/foodLogSchema.js";
import User from "../models/userSchema.js"
import DailySummary from "../models/dailySummarySchema.js";

export const addFoodLog = async (req, res) => {
  try {
    // Find user by Firebase UID
    const user = await User.findOne({ firebaseUid: req.body.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2 Create FoodLog with MongoDB user _id
    const foodLog = new FoodLog({
      ...req.body,
      userId: user._id,  // use MongoDB ObjectId
    });

    const savedFoodLog = await foodLog.save();

    const { calories, protein, carbs, fat } = req.body.nutrients;

    // Find or create a daily summary for today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    let dailySummary = await DailySummary.findOne({
      userId: user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!dailySummary) {
      dailySummary = new DailySummary({
        userId: user._id,
        date: new Date(),
        totalCalories: user.dailyCalories,
        totalProtein: user.dailyProtein,
        totalCarbs: user.dailyCarbs,
        totalFat: user.dailyFat,
      });
    }

    dailySummary.totalCalories += calories;
    dailySummary.totalProtein += protein;
    dailySummary.totalCarbs += carbs;
    dailySummary.totalFat += fat;

    await dailySummary.save();

    res.status(201).json({
      message: "Food log added and daily summary updated successfully",
      foodLog: savedFoodLog,
    });
  } catch (error) {
    console.error(" Error saving food log:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDailyFoodLogs = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { date } = req.query; 
    
    // Find the user by Firebase UID
    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Convert date string to start and end of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch food logs by MongoDB _id
    const foodLogs = await FoodLog.find({
      userId: user._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    res.status(200).json({ success: true, data: foodLogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
