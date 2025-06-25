const { boolean, required } = require("joi");
const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const passwordChangeLogSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  method: {
    type: String,
    enum: ["manual", "reset"],
    required: true
  },

  otp:{
    type : String,
    required: true
  },

  used: {
    type: Boolean,
    required: true,
    default: false
  },
  tokenUsed: {
    type: String,
    default: null
  },

  expiredAt: {
    type: Date, 
    default: null
  },
  changedAt: {
    type: Date,
    default: Date.now
  },

  ip: String,
  userAgent: String
});

module.exports = model("PasswordChangeLog", passwordChangeLogSchema);
