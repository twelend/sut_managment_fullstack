import { z } from "zod";

export const ContestSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
  })

export type TypeContestSchema = z.infer<typeof ContestSchema>
