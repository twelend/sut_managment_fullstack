import { authService } from "@/features/Login/auth.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLogoutMutation() {
  const { mutateAsync: logout, isPending: isLoadingLogout } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      await authService.logout();
    },
    onSuccess: () => {
      toast("Выход успешно выполнен!");
    },
  });
  return { logout, isLoadingLogout };
}
