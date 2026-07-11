import axios from "axios";

export async function fetchUSDAFoods(query) {
  try {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}`;

    const res = await axios.post(url, {
      query,
      pageSize: 50,
      dataType: ["Survey (FNDDS)", "Foundation", "Branded"]
    });

    return res.data.foods || [];

  } catch (err) {
    console.error("USDA fetch error:", err);
    return [];
  }
}

// Extract only needed nutrient values
export function extractNutrients(food) {
  const obj = {
    name: food.description,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };

  if (!food.foodNutrients) return obj;

  food.foodNutrients.forEach(n => {
    if (n.nutrientName.includes("Energy") && n.unitName === "KCAL")
      obj.calories = n.value;

    if (n.nutrientName.includes("Protein"))
      obj.protein = n.value;

    if (n.nutrientName.includes("Carbohydrate"))
      obj.carbs = n.value;

    if (n.nutrientName.includes("Total lipid"))
      obj.fat = n.value;
  });

  return obj;
}

const NUTRIENTS_TO_SHOW = [
  "Energy",
  "Protein",
  "Carbohydrate, by difference",
  "Total lipid (fat)",
  "Fiber, total dietary",
  "Sugars, total including NLEA",
];

export const fetchFoodNutrition = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Food query is required" });
  }

  try {
    const response = await axios.get(
      "https://api.nal.usda.gov/fdc/v1/foods/search",
      {
        params: {
          query,
          pageSize: 1,
          api_key: process.env.USDA_API_KEY,
        },
      }
    );

    const food = response.data.foods?.[0];
    if (!food) {
      return res.status(404).json({ message: "No food found" });
    }

    const nutrients = food.foodNutrients.filter((n) =>
      NUTRIENTS_TO_SHOW.includes(n.nutrientName)
    );

    res.json({
      foodId: food.fdcId,
      foodName: food.description,
      nutrients,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch nutrition data" });
  }
}