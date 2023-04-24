const mongoose = require("mongoose");

const CampgroundSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    district: {
      type: String,
      required: [true, "Please add a district"],
    },
    province: {
      type: String,
      required: [true, "Please add a province"],
    },
    postalcode: {
      type: String,
      required: [true, "Please add a postal code"],
      maxlength: [5, "Postal Code can not be more than 5 digits"],
    },
    region: {
      type: String,
      required: [true, "Please add a region"],
    },
    telephone: {
      type: String,
      required: [true, "Please add a phone number"],
      maxlength: [10, "Telephone can not be more than 10 digits."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Campground", CampgroundSchema);
