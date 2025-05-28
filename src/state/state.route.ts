import { Router } from "express";
import { createState, deleteState, getStateById, getStates, updateState } from "./state.controller";

export const stateRouter = Router();

// State routes definition


// Get all users
stateRouter.get('/', getStates);

// Get user by ID
stateRouter.get('/:id', getStateById);

// Create a new user
stateRouter.post('/', createState);

// Update an existing user
stateRouter.put('/:id',updateState);


// Delete an existing user
stateRouter.delete('/:id', deleteState);