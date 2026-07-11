import User from "../models/userSchema.js";
import DailySummary from "../models/dailySummarySchema.js";
import { fetchUSDAFoods, extractNutrients } from "../services/usdaService.js";

export const getFoodRecommendations = async (req, res) => {
  try {
    const { userId, filterType, foodCategory } = req.body;

    if (!userId) return res.status(400).json({ message: "userId required" });
    // -------------------------------
    // 1. FETCH USER DAILY TARGET FROM DB
    // -------------------------------
    const user = await User.findOne({ firebaseUid: userId });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const target = user.dailyNutritionTarget;

    // -------------------------------
    // 2. FETCH TODAY'S NUTRITION SUMMARY
    // -------------------------------
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailySummary = await DailySummary.findOne({
      userId: user._id,
      date: today
    });

    const consumed = dailySummary || {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0
    };

    // -------------------------------
    // 3. CALCULATE REMAINING NUTRITION
    // -------------------------------
    const remaining = {
      calories: target.calories - consumed.totalCalories,
      protein: target.protein - consumed.totalProtein,
      carbs: target.carbs - consumed.totalCarbs,
      fat: target.fat - consumed.totalFat
    };

    Object.keys(remaining).forEach(
      key => remaining[key] = Math.max(0, remaining[key])
    );

    // -------------------------------
    // 4. BUILD USDA QUERY BASED ON FILTERS
    // -------------------------------
    let query = "Indian "; // base keyword

    // Add category-specific Indian foods
    const indianFoods = {
      veg: ["paneer", "dal", "sabzi", "roti", "paratha", "idli", "dosa", "chana", "rajma"],
      nonveg: ["chicken", "mutton", "fish", "egg", "prawn", "tikka", "curry"],
      fruit: ["mango", "banana", "guava", "papaya", "apple", "orange"],
      raw: ["tomato", "cucumber", "carrot", "spinach", "onion"],
      processed: ["pickle", "snack", "namkeen", "sweets"]
    };

    if (foodCategory && indianFoods[foodCategory]) {
      query += indianFoods[foodCategory].join(" ") + " ";
    }

    // Nutrient priority 
    if (filterType === "protein") query += "high protein ";
    if (filterType === "carbs") query += "high carb ";
    if (filterType === "fat") query += "high fat ";
    if (filterType === "calories") query += "high energy calorie dense ";

    // -------------------------------
    // 5. FETCH FOODS FROM USDA API
    // -------------------------------
    const foods = await fetchUSDAFoods(query.trim());

    // -------------------------------
    // 6. NORMALIZE NUTRIENTS
    // -------------------------------
    const parsedFoods = foods.map(food => extractNutrients(food));

    // -------------------------------
    // 7. SORT BASED ON FILTER
    // -------------------------------
    parsedFoods.sort((a, b) => {
      if (filterType === "protein") return b.protein - a.protein;
      if (filterType === "carbs") return b.carbs - a.carbs;
      if (filterType === "fat") return b.fat - a.fat;
      return b.calories - a.calories;
    });

    // -------------------------------
    // 8. LIMIT RESULTS
    // -------------------------------
    const topFoods = parsedFoods.slice(0, 25);

    res.status(200).json({
      remaining,
      recommendations: topFoods
    });

  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ message: "Server error generating recommendations" });
  }
};
