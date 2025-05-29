import express, { Application, Response } from "express";
import dotenv from "dotenv";
import { logger } from "./middleware/logger";
import { userRouter } from "./users/user.route";
import { stateRouter } from "./state/state.route";
import { cityRouter } from "./city/city.route";
import { authRouter } from "./auth/auth.route";
import { adminRoleAuth } from "./middleware/bearAuth";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Basic Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Default route
app.get("/", (req, res: Response) => {
  res.send("Welcome to Express API Backend with Drizzle ORM and PostgreSQL");
});

// Mount routers with specific prefixes
app.use("/api/users", userRouter);
app.use("/api/states", adminRoleAuth, stateRouter);
app.use("/api/cities", adminRoleAuth,cityRouter);
app.use("/api/auth", authRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
