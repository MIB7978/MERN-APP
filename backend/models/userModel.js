const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const usermodel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type:String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

usermodel.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
usermodel.pre("save", async function (next) {
  // if (!this.isModified('password')) {
  //   console.log(this.isModified(this.password));
  //   next();
  // }

  console.log(this.isModified("password"));
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
const User = mongoose.model("User", usermodel);

module.exports = User;
