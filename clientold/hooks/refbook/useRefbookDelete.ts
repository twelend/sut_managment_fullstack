import { refbookService } from "@/features/Dashboard/Refbook/refbook.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useRefbookDelete() {
  const queryClient = useQueryClient();
  const {
    mutateAsync: deleteTemplate,
    isPending: isDeletingTemplate,
    error,
  } = useMutation({
    mutationKey: ["delete_refbook_template"],
    mutationFn: (id: number) => {
      return refbookService.delete(id);
    },
    onSuccess: () => {
      toast.success("Шаблон удалён.");
      queryClient.invalidateQueries({ queryKey: ["refbook"] });
    },
    onError: (mutationError: any) => {
      toast.error("Не удалось удалить шаблон.");
      console.error("Ошибка удаления шаблона:", mutationError);
    },
  });

  return { deleteTemplate, isDeletingTemplate, error };
}

