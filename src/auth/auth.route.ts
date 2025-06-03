import { Router } from "express";
import {  createUser, loginUser, passwordReset,updatePassword } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register", createUser);
authRouter.post("/login", loginUser);
authRouter.post("/password-reset", passwordReset);
authRouter.put("/reset/:token", updatePassword);
