import mongoose from "mongoose"

const availabilitySchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
        tasks: [String],
        location: String,
        isActive:{type: Boolean, default: true},
    },
    {timestamps: true}
);
    export default mongoose.model("Availability", availabilitySchema);