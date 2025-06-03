import { z } from "zod/v4";

export const StateValidator = z.object({
    stateId: z.number().optional(),
    stateName: z.string().min(10).max(100).trim(),
    stateCode: z.string().length(2).trim(),
});