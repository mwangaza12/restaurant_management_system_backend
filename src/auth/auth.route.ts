import { Router } from "express";
import {  createUser, loginUser } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register", createUser);
authRouter.post("/login", loginUser);
