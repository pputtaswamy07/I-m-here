import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  location: String,

  role: {
    type: String,
    default: "VOLUNTEER"
  }

}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);