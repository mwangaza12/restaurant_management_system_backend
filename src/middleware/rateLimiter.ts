import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextFunction, Request, Response } from "express";

const rateLimiter = new RateLimiterMemory({
  points: 10, // Number of requests allowed
  duration: 60, // Per second
});

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await rateLimiter.consume(req.ip || 'unknown'); // Consume a point for the request
        console.log(`Rate limit check passed for IP: ${req.ip}`);
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(429).json({error:'Too Many Requests, please try again later.'}); // Respond with 429 status code if limit exceeded
    }
};