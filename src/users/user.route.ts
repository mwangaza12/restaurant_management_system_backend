import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "./user.controller";
import { adminRoleAuth, bothRoleAuth } from "../middleware/bearAuth";
 
export const userRouter = Router();
 
// User routes definition
 
 
// Get all users
userRouter.get('/',adminRoleAuth, getUsers);
 
// Get user by ID
userRouter.get('/:id', getUserById);
 
// Create a new user
userRouter.post('', createUser);
 
// Update an existing user
userRouter.put('/:id',bothRoleAuth,updateUser);
 
 
// Delete an existing user
userRouter.delete('/:id',adminRoleAuth, deleteUser);