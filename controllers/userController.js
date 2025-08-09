import User from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import validator from "validator";

const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

const updateMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  if (req.body["email"]) {
    const isValidEmail = validator.isEmail(req.body["email"]);
    if (!isValidEmail) {
      return next(new AppError("Please enter a valid email.", 400));
    }
  }

  const allowedFields = ["name", "email"];
  const updates = {};
  allowedFields.forEach((allowedField) => {
    if (req.body[allowedField] !== undefined) {
      updates[allowedField] = req.body[allowedField];
    }
  });

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user.id },
    updates,
    {
      new: true,
    }
  );

  if (!updatedUser) {
    return next(
      new AppError("Couldn't update your profile. Try again later.", 400)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    },
  });
});

// TODO: Delete me

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  await User.findOneAndDelete({ _id: req.params.id });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export default { getMe, updateMe, deleteUser };
