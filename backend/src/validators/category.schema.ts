import { z } from "zod";

export const categoryBodySchema = z.object({
  name: z.string().min(1).max(100),
});
export type CategoryBodyInput = z.infer<typeof categoryBodySchema>;
