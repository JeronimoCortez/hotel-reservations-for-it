import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    _id: String,
    userId: { type: String, ref: "User", required: true },
    roomId: { type: String, ref: "Room", required: true },
    startDate: { type: String, required: true }, // LocalDate YYYY-MM-DD
    endDate: { type: String, required: true }, // LocalDate YYYY-MM-DD (exclusive)
    status: { type: String, required: true }
}, { timestamps: true, _id: false });

export default mongoose.model("Reservation", reservationSchema);
