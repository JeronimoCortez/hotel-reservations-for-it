import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    _id: String,
    userId: { type: String, ref: "User", required: true },
    roomId: { type: String, ref: "Room", required: true },
    startDate: Date,
    endDate: Date,
    status: String
}, { timestamps: true, _id: false });

export default mongoose.model("Reservation", reservationSchema);