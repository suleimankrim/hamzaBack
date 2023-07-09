import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the cell schema
const cellSchema = new Schema({
    rowId: {
        type: String,
    },
    colId: {
        type: String,
    },
    value: {
        type: String,
    }
});

// Create the cell model

cellSchema.index({ rowId: 1, colId: 1 }, { unique: true });
export default mongoose.model('Cell', cellSchema);

