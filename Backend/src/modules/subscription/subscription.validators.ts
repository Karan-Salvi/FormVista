import { z } from 'zod';

export const createCheckoutSessionSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
});

export type CreateCheckoutSessionInput = z.infer<
  typeof createCheckoutSessionSchema
>;
