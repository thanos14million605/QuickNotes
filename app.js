import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import globalErrorHandler from "./middleware/globalErrorHandler.js";
import AppError from "./utils/AppError.js";

// Routers
import noteRouter from "./routes/noteRoutes.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userNotes.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("I am a middleware");
  next();
});

app.use("/api/v1/notes", noteRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use((req, _, next) => {
  return next(
    new AppError(`Couldn't find ${req.originalUrl} on this server!`, 404)
  );
});
app.use(globalErrorHandler);

export default app;
