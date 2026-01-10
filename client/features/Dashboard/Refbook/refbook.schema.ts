import { z } from "zod";

export const RefbookSchema = z.object({
  title: z.string().min(1, "Введите название шаблона"),
  content: z.string().min(1, "Введите текст шаблона"),
});

export type TypeRefbookSchema = z.infer<typeof RefbookSchema>;

