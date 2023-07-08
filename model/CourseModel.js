import mongoose from "mongoose";

export const CourseSchema = new mongoose.Schema({
        title: {
        type: String,
        unique: true,
        required: true,

    },
    description: {
        type: String,
        required: true,
    },
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
    },
})

export default mongoose.model('Course', CourseSchema);