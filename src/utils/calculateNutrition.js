export function calculateNutrition({ age, gender, height, weight, goal, activityLevel }) {
  // Convert numeric fields safely
  age = Number(age);
  height = Number(height);
  weight = Number(weight);

  // Map activity levels to numeric multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };

  const multiplier = activityMultipliers[activityLevel];

  if (isNaN(age) || isNaN(height) || isNaN(weight) || !multiplier) {
    throw new Error("Invalid numeric input");
  }

  // 1️⃣ Calculate BMR (Basal Metabolic Rate)
  let BMR;
  if (gender === "male") {
    BMR = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    BMR = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // 2️⃣ Adjust for activity level
  let maintenanceCalories = BMR * multiplier;

  // 3️⃣ Adjust for goal
  let targetCalories;
  switch (goal) {
    case "weight_loss":
      targetCalories = maintenanceCalories - 500;
      break;
    case "muscle_gain":
      targetCalories = maintenanceCalories + 300;
      break;
    default:
      targetCalories = maintenanceCalories;
  }

  // 4️⃣ Macronutrient breakdown
  const protein = weight * 1.8;
  const fat = (targetCalories * 0.25) / 9;
  const carbs = (targetCalories - (protein * 4 + fat * 9)) / 4;

  // 5️⃣ Round values
  return {
    calories: Math.round(targetCalories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
  };
}
