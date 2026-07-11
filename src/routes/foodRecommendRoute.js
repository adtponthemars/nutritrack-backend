import express from "express";
// import { recommendFoods } from "../controllers/recommendationController.js";
 import { getFoodRecommendations } from "../controllers/recommendationController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.get("/recommendations", verifyToken, recommendFoods);
router.post("/recommend-foods", getFoodRecommendations);


export default router;
