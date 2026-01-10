import { authService } from "@/features/Login/auth.service";
import { TypeLoginSchema } from "@/features/Login/login.schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLoginMutation() {
  const router = useRouter();
  const { mutateAsync: login, isPending: isLoadingLogin } = useMutation({
    mutationKey: ["login_teacher"],
    mutationFn: ({ values }: { values: TypeLoginSchema }) => {
      return authService.login(values);
    },
    onSuccess: (response: any) => {
      toast.success("Успешный вход", {
        description: "Желаю эффективно поработать!",
        duration: 3000,
      });
      router.push("/teacher/dashboard/");
    },
    onError: (error) => {
      toast.error("Неверный логин или пароль", {
        duration: 3000,
      });
      console.error("Ошибка авторизации: ", error);
    },
  });

  return { login, isLoadingLogin };
}
