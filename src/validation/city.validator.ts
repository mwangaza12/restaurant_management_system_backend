import { z } from "zod/v4";

export const CityValidator = z.object({
    cityId: z.number().optional(),
    cityName: z.string().min(2).max(100).trim(),
    stateId: z.number().int().positive(),
});