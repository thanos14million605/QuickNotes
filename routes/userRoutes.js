import express from "express";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";

const router = express.Router();

router.use(authController.protectRoute);

router.get("/me", userController.getMe);

router.patch("/update-me", userController.updateMe);

router.use(authController.restrictTo("admin"));

router.delete("/:id", userController.deleteUser);

export default router;
