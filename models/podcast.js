const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const podcastSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    featuring: [{ type: String }],
    img: String,
    type: { type: String, enum: ["Free", "VIP", "Premium"], default: "Free" },
    url: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Podcast", podcastSchema);
