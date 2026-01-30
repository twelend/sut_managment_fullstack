import { TypeSubjectSchema } from "@/features/Dashboard/Subject/subject.schema";
import { subjectService } from "@/features/Dashboard/Subject/subject.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSubjectMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync: createSubject, isPending: isCreatingSubject } =
    useMutation({
      mutationKey: ["create_subject"],
      mutationFn: ({ values }: { values: TypeSubjectSchema }) => {
        return subjectService.create(values);
      },
      onSuccess: () => {
        toast.success("Занятие успешно создано!");
        queryClient.invalidateQueries({ queryKey: ["subjects"] });
      },
      onError: (error) => {
        console.error("Ошибка создания занятия:", error);
        toast.error("Не удалось создать занятие, попробуйте позже.");
      },
    });

  return { createSubject, isCreatingSubject };
}

export function useSubjectUpdate() {
  const queryClient = useQueryClient();
  const { mutateAsync: updateSubject, isPending: isUpdatingSubject } =
    useMutation({
      mutationKey: ["update_subject"],
      mutationFn: ({
        id,
        values,
      }: {
        id: number;
        values: Partial<TypeSubjectSchema>;
      }) => {
        return subjectService.update(id, values);
      },
      onSuccess: () => {
        toast.success("Занятие успешно обновлено!");
        queryClient.invalidateQueries({ queryKey: ["subjects"] });
      },
      onError: (error) => {
        console.error("Ошибка обновления занятия:", error);
        toast.error("Не удалось обновить занятие, попробуйте позже.");
      },
    });

  return { updateSubject, isUpdatingSubject };
}

