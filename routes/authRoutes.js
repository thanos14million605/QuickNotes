import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.use(authController.protectRoute);
router.post("/logout", authController.logout);

export default router;
