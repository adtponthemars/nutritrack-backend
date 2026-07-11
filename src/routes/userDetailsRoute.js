import express from "express";
import { saveNutritionData } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import User from "../models/userSchema.js";


const router = express.Router();

// POST /api/user-data
router.post("/", verifyToken, saveNutritionData);


router.get("/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const user = await User.findOne({ firebaseUid });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/user/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/user/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const updates = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid },
      updates,
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
