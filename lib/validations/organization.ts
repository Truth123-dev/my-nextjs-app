import { z } from "zod";

export const CreateOrganizationSchema = z.object({
  name: z.string().trim().min(2).max(100),
});

export type CreateOrganizationInput = z.infer<typeof CreateOrganizationSchema>;
