import { Request, Response } from "express";
import { createUserServices, getUserByEmailService,updateUserPasswordService } from "./auth.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserLoginValidator, UserValidator } from "../validation/user.validator";
import { sendNotificationEmail } from "../middleware/googleMailer";
import { getUserByIdServices } from "../users/user.service";

export const createUser = async (req: Request, res: Response) => {     
    try {
         // Validate user input
        const parseResult = UserValidator.safeParse(req.body);
        if (!parseResult.success) {
             res.status(400).json({ error: parseResult.error.issues });
             return;
        }
        const user = parseResult.data;
        const userEmail = user.email;

        const existingUser = await getUserByEmailService(userEmail);
        if (existingUser) {
            res.status(400).json({ error: "User with this email already exists" });
            return;
        }

        // Genereate hashed password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(user.password,salt);
        user.password = hashedPassword;

        // Call the service to create the user
        const newUser = await createUserServices(user);
        const results = await sendNotificationEmail(user.email, user.fullName, "Account created successfully", "Welcome to our food service</b>");
        if (!results) {
            res.status(500).json({ error: "Failed to send notification email" });
            return;
        }else {
            console.log("Email sent successfully:", results);
        }     
        res.status(201).json(newUser);    

    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to create user" });
    }
}

//Login User
export const loginUser = async (req: Request, res: Response) => {
    try {
        const parseResult = UserLoginValidator.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.issues });
            return;
        }
        const { email, password } = parseResult.data;

        // Check if user exists
        const user = await getUserByEmailService(email);
        // console.log("🚀 ~ loginUser ~ user:", user)
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Compare passwords
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
             res.status(401).json({ error: "Invalid password" });
             return;
        }

        //Generate a token
        let payload ={
            userId: user.userId,
            email: user.email,
            userType: user.userType,
            //expiresIn: "1h" // Optional: Set token expiration
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // Token expires in 1 hour
        }

        let secret = process.env.JWT_SECRET as string;
        const token = jwt.sign(payload, secret);

        res.status(200).json({ token, userId: user.userId, email: user.email, userType: user.userType });
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to login user" });
    }
}

export const passwordReset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: "Email is required" });
            return;
        }

        const user = await getUserByEmailService(email);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Generate a reset token (for simplicity, using JWT)
        const secret = process.env.JWT_SECRET as string;
        const resetToken = jwt.sign({ userId: user.userId }, secret, { expiresIn: '1h' });

        // Send reset email (you can implement this function)
        const results = await sendNotificationEmail(email, "Password Reset", user.fullName, `Click the link to reset your password: <a href="http://localhost:5000/api/auth/reset/${resetToken}">Reset Password</a>`);
        
        if (!results) {
            res.status(500).json({ error: "Failed to send reset email" });
            return;
        }

        res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to reset password" });
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token) {
            res.status(400).json({ error: "Token is required" });
            return;
        }

        if (!password) {
            res.status(400).json({ error: "Password is required" });
            return;
        }

        const secret = process.env.JWT_SECRET as string;
        const payload: any = jwt.verify(token, secret);

        // Fetch user by ID from token
        const user = await getUserByIdServices(payload.userId);

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Now use the user's email from DB
        await updateUserPasswordService(user.email, hashedPassword);

        res.status(200).json({ message: "Password has been reset successfully" });

    } catch (error: any) {
        res.status(500).json({ error: error.message || "Invalid or expired token" });
    }
};