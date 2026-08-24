import mongoose from "mongoose";

const helpRequestSchema = new mongoose.Schema(
  {
    seeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["GROCERY", "TRANSPORT", "COMPANIONSHIP", "ERRANDS", "OTHER"],
      default: "OTHER",
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "CANCELLED"],
      default: "OPEN",
    },
  },
  { timestamps: true }
);

export default mongoose.model("HelpRequest", helpRequestSchema);
