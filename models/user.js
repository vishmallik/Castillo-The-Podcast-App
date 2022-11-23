const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, match: /@/, required: true, unique: true },
    password: { type: String, required: true, minlength: 5 },
    type: { type: String, enum: ["Free", "VIP", "Premium"], default: "Free" },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err);
      this.password = hashed;
      return next();
    });
  } else {
    return next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

module.exports = mongoose.model("User", userSchema);
