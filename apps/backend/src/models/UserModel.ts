import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: String,
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String
}, { timestamps: true, _id: false });

export default mongoose.model("User", userSchema);