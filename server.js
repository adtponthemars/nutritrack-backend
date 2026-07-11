import express from "express";
import foodLogRoutes from "./src/routes/foodLogRoute.js"
import userDetailsRoute from "./src/routes/userDetailsRoute.js"
import nutritionSumRoute from './src/routes/nutrtionSumRoute.js'
import foodRecommendRoute from './src/routes/foodRecommendRoute.js'
import mongoose from "mongoose";
import cors from "cors";
import "./src/config/firebaseAdmin.js"

const app = express();
app.use(express.json());
app.use(cors());

// ROUTES
app.use("/api/foodlog", foodLogRoutes);
app.use("/api/user-data", userDetailsRoute);
app.use("/api/summary", nutritionSumRoute);
app.use("/api", foodRecommendRoute)

// CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection failed:", err));

app.listen(5000, () => console.log("Server running on port 5000"));

