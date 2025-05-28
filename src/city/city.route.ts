import { Router } from "express";
import { createCity, deleteCity, getCities, getCityById, updateCity } from "./city.controller";
 
export const cityRouter = Router();
 
// User routes definition
 
 
// Get all users
cityRouter.get('/', getCities);
 
// Get user by ID
cityRouter.get('/:id', getCityById);
 
// Create a new user
cityRouter.post('/', createCity);
 
// Update an existing user
cityRouter.put('/:id',updateCity);
 
 
// Delete an existing user
cityRouter.delete('/:id', deleteCity);
 