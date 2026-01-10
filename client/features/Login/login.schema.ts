import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("Email не прошел валидацию..."),
  password: z.string().min(4, {
    message: "Пароль минимум 4 символа",
  }),
});

export type TypeLoginSchema = z.infer<typeof LoginSchema>;
