import { TypeRefbookSchema } from "@/features/Dashboard/Refbook/refbook.schema";
import { refbookService } from "@/features/Dashboard/Refbook/refbook.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useRefbookMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync: createTemplate, isPending: isCreatingTemplate } =
    useMutation({
      mutationKey: ["create_refbook_template"],
      mutationFn: ({ values }: { values: TypeRefbookSchema }) => {
        return refbookService.create(values);
      },
      onSuccess: () => {
        toast.success("Шаблон успешно создан!");
        queryClient.invalidateQueries({ queryKey: ["refbook"] });
      },
      onError: (error) => {
        toast.error("Не удалось создать шаблон, попробуйте позже.");
        console.error("Ошибка создания шаблона:", error);
      },
    });

  return { createTemplate, isCreatingTemplate };
}

