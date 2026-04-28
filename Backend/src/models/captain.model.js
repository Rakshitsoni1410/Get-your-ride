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

  phone: {                          // ✅ mobile number
    type: String,
    required: true
  },

  vehicle: {
    color: String,
    plate: { type: String, required: true },
    capacity: Number,
    vehicleType: {
      type: String,
      enum: ["car", "bike", "auto"],   // controlled values
      required: true
    }
  },

  license: {                        // ✅ driving license
    number: { type: String, required: true },
    expiry: Date
  },

  documents: {                      // ✅ real-world requirement
    rc: String,                     // registration certificate
    insurance: String
  },

  rental: {                         // ✅ if vehicle is rented
    isRental: { type: Boolean, default: false },
    ownerName: String,
    ownerPhone: String
  },

  status: {                         // driver availability
    type: String,
    enum: ["offline", "online", "onride"],
    default: "offline"
  },

  location: {                       // for live tracking (future)
    lat: Number,
    lng: Number
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

captainSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

captainSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Captain", captainSchema);