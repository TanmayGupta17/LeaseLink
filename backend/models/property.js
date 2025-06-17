const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "available",
  },
  type: {
    type: String,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  amenities: {
    type: Array,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  leaseDuration: {
    type: String,
    required: true,
  },
  reported: {
    type: Boolean,
    default: false,
  },
  furnished: {
    type: String,
    enum: ["furnished", "semi-furnished", "unfurnished"],
    required: true,
  },
  Verification: {
    type: String,
    enum: ["verified", "unverified", "pending"],
    default: "pending",
  },
});

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
