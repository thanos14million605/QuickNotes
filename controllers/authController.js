import User from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "../utils/jwt.js";
import AppError from "./../utils/AppError.js";

const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return next(new AppError("All fields are required.", 400));
  }

  const isExistingUser = await User.findOne({ email });
  if (isExistingUser) {
    return next(new AppError("User already exist. Please log in.", 400));
  }

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  res.status(201).json({
    status: "success",
    data: {
      name: newUser.name,
      email: newUser.email,
    },
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new AppError("Both email and password fields are required.", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Invalid credentials.", 401));
  }

  const isMatch = user.isPasswordCorrect(password, user.password);
  if (!isMatch) {
    return next(new AppError("Invalid credentials.", 401));
  }

  const accessToken = await jwt.signAccessToken(
    user,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN
  );

  res.cookie("accessToken", accessToken, {
    maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    status: "success",
    accessToken,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

const logout = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    return next(new AppError("Missing token. Please log in again.", 401));
  }

  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully.",
  });
});

const protectRoute = asyncHandler(async (req, res, next) => {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.header.authorization.split(" ")[0];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  // Check if token exists.
  if (!token) {
    return next(new AppError("Missing token. Please log in again.", 401));
  }

  // Verify token
  const decoded = await jwt.verifyAccessToken(token, process.env.JWT_SECRET);

  console.log(decoded.id);
  // Check if user exits.
  const user = await User.findById(decoded.id).select("+passwordChangedAt");
  if (!user) {
    return next(
      new AppError("User belonging to this token no longer exist.", 401)
    );
  }

  // Check if user has changed password after the token was issued.
  if (
    user.passwordChangedAt &&
    Date.parse(user.passwordChangedAt) > decoded.iat * 1000
  ) {
    return next(
      new AppError("Password changed recently. Please log in again.", 401)
    );
  }

  // If everything is okay, then add the user to the req object.
  req.user = user;
  next();
});

const restrictTo = (...roles) => {
  return async (req, _, next) => {
    const user = await User.findById(req.user.id).select("+role");
    if (!roles.includes(user.role)) {
      return next(
        new AppError(
          "Forbidden. You don't have permission to access this resource.",
          403
        )
      );
    }

    next();
  };
};

export default { protectRoute, restrictTo, signup, login, logout };
