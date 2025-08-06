import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name."],
      maxlength: [70, "Name too long."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      select: false,
      minlength: [8, "Password must be at least 8 chars."],
    },
    passwordConfirm: {
      type: String,
      required: [true, "Password confirm is required."],
      select: false,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password and password confirm do not match.",
      },
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    role: {
      type: String,
      default: "user",
      select: false,
      enum: {
        values: ["admin", "user"],
        message: "Role not specified.",
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.isPasswordCorrect = async function (candidate, actual) {
  return await bcrypt.compare(candidate, actual);
};

const User = mongoose.model("User", userSchema);

export default User;
