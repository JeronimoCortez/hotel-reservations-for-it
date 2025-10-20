import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error: ", err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})