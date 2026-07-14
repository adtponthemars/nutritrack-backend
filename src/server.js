import express from "express";
import foodLogRoutes from "./routes/foodLogRoute.js"
import userDetailsRoute from "./routes/userDetailsRoute.js"
import nutritionSumRoute from './routes/nutrtionSumRoute.js'
import foodRecommendRoute from './routes/foodRecommendRoute.js'
import mongoose from "mongoose";
import cors from "cors";
import "./config/firebaseAdmin.js"
import { credential } from "firebase-admin";

const app = express();
app.use(express.json());
app.use(cors({
  origin: `https://nutritrack-frontend-chi.vercel.app/`,
  credential: true
}
));

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

