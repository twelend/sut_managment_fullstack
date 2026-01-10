import { z } from "zod";

export const SubjectSchema = z.object({
  title: z.string().min(1, "Введите название занятия"),
  description: z.string().optional(),
  capacity: z.number().int().min(1, "Минимум 1 место"),
  enrolled: z.number().int().min(0, "Не может быть отрицательным"),
  status: z.enum(["open", "closed"]),
});

export type TypeSubjectSchema = z.infer<typeof SubjectSchema>;

