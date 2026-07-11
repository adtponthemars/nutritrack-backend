import express from "express";
import { getDailySummary } from "../controllers/dailySummaryController.js";
const router = express.Router();

router.get("/:firebaseUid", getDailySummary);

export default router;