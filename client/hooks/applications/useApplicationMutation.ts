import { applicationsService } from "@/features/Dashboard/Applications/applications.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useApplicationMutation(type: string) {
  const queryClient = useQueryClient();
  const {
    mutateAsync: acceptApplication,
    isPending: isLoadingAccept,
    status: sendingStatus,
  } = useMutation({
    mutationKey: ["applicationAccept", type],
    mutationFn: ({
      id,
      action,
      message,
    }: {
      id: number;
      action: string;
      message: string;
    }) => {
      if (!id) throw new Error("ID заявки не указан");

      let url: string = `/api/teacher/application/${type}/${id}/action/`;
      let body = {
        action: action,
        message: message,
      };

      return applicationsService.accept(url, body);
    },
    onSuccess: (response: any) => {
      toast.success("Заявка успешно принята!");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: () => {
      toast.error("Ошибка принятия заявки!");
    },
  });

  return { acceptApplication, isLoadingAccept, sendingStatus };
}
