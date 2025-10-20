import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    _id: String,
    number: Number,
    type: String,
    price: Number,
    available: Boolean
}, { timestamps: true, _id: false });

export default mongoose.model("Room", roomSchema);