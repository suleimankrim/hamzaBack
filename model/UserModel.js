import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,

    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    firstName:String,
    lastName:String,
    phoneNumber:String,
    address:String,
    profile: String
})

export default mongoose.model('User', UserSchema);