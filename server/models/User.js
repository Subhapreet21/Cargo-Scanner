const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, minlength: 3 },
    password: { type: String, required: true, minlength: 6 },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    role: {
      type: String,
      required: true,
      enum: ["administrator", "employee", "manager", "customer"],
    },
    mobileNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number is not valid"],
    },
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other", "prefer not to say"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
