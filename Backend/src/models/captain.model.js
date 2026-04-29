const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: { type: String, required: true },
    lastname: { type: String }
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true,
    unique: true
  },

  vehicle: {
    color: String,
    plate: { type: String, required: true },
    capacity: Number,
    vehicleType: {
      type: String,
      enum: ["car", "bike", "auto"],
      required: true
    }
  },

  license: {
    number: { type: String, required: true },
    expiry: Date
  },

  documents: {
    rc: String,
    insurance: String
  },

  rental: {
    isRental: { type: Boolean, default: false },
    ownerName: String,
    ownerPhone: String
  },

  status: {
    type: String,
    enum: ["offline", "online", "onride"],
    default: "offline"
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },

  rating: {
    type: Number,
    default: 5
  },

  totalRides: {
    type: Number,
    default: 0
  },

  isVerified: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

captainSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

captainSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Captain", captainSchema);