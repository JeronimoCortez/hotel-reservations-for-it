import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import userRouter from "./routes/UserRoutes";
import roomRouter from "./routes/RoomRoutes";
import reservationRouter from "./routes/ReservationRoutes";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error: ", err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.use("/users", userRouter);
app.use("/rooms", roomRouter);
app.use("/reservations", reservationRouter);
