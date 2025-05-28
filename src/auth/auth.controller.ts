import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUserServices, getUserByEmailService } from "./auth.service";

// Register Logic
export const createUser = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password, userType } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userToCreate = { fullName, email, password: hashedPassword, userType };
        const newUser = await createUserServices(userToCreate);

        res.status(201).json({ message: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Login Logic
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const existingUser = await getUserByEmailService(email);

        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const payload = {
            userId: existingUser.userId,
            email: existingUser.email,
            fullName: existingUser.fullName,
            userType: existingUser.userType
        };

        const secret = process.env.JWT_SECRET as string;
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        res.status(200).json({
            token,
            userId: existingUser.userId,
            email: existingUser.email,
            fullName: existingUser.fullName,
            userType: existingUser.userType
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
