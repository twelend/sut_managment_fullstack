import { subjectService } from "@/features/Dashboard/Subject/subject.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSubjectDelete() {
  const queryClient = useQueryClient();
  const {
    mutateAsync: deleteSubject,
    isPending: isDeletingSubject,
    error,
  } = useMutation({
    mutationKey: ["delete_subject"],
    mutationFn: (id: number) => subjectService.delete(id),
    onSuccess: () => {
      toast.success("Занятие удалено.");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (mutationError: any) => {
      console.error("Ошибка удаления занятия:", mutationError);
      toast.error("Не удалось удалить занятие.");
    },
  });

  return { deleteSubject, isDeletingSubject, error };
}

