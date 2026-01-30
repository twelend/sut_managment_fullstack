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
    onSuccess: () => {
      toast.success("Заявка успешно принята!");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      if (type === "subject") {
        queryClient.invalidateQueries({ queryKey: ["subjects"] });
        queryClient.invalidateQueries({ queryKey: ["landing", "subjects"] });
      } else if (type === "contest") {
        queryClient.invalidateQueries({ queryKey: ["contests"] });
        queryClient.invalidateQueries({ queryKey: ["landing", "contests"] });
      }
    },
    onError: () => {
      toast.error("Ошибка принятия заявки!");
    },
  });

  return { acceptApplication, isLoadingAccept, sendingStatus };
}
