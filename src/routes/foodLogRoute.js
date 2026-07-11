import express from "express";
import { addFoodLog, getDailyFoodLogs } from "../controllers/foodLogController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { fetchFoodNutrition } from "../services/usdaService.js";

const router = express.Router();

router.post("/", addFoodLog);
router.get('/', fetchFoodNutrition);
router.get("/user/:firebaseUid", getDailyFoodLogs);

export default router;
