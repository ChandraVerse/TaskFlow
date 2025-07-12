import express from "express";
import {getUserProfile, loginUser, registerUser, updateUserPassword, updateUserProfile} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// PUBLIC LINKS

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// PRIVATE LINKS
userRouter.get("/me", authMiddleware, getUserProfile);
userRouter.put("/profile", authMiddleware, updateUserProfile);
userRouter.put("/password", authMiddleware, updateUserPassword);

export default userRouter;