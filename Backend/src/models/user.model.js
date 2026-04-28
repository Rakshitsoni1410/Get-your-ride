const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: { type: String, required: true },
    lastname: { type: String }
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
    type: String
  },

  addresses: [   // ✅ future-ready
    {
      label: {
        type: String,
        enum: ["home", "work", "other"]
      },
      address: String,
      lat: Number,
      lng: Number
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});


// 🔐 hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// 🔑 compare password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);