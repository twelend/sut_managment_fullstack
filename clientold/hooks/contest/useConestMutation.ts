import { TypeContestSchema } from "@/features/Dashboard/Contest/contest.schema";
import { contestService } from "@/features/Dashboard/Contest/contest.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useContestMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync: createContest, isPending: isLoadingCreationContext } =
    useMutation({
      mutationKey: ["create_contest"],
      mutationFn: ({ values }: { values: TypeContestSchema }) => {
        return contestService.create(values);
      },
      onSuccess: (response: any) => {
        toast.success("Конкурс успешно создан!");
        queryClient.invalidateQueries({ queryKey: ["contests"] });
      },
      onError: (error) => {
        toast.error("Что-то пошло не так, попробуйте позже...");
        console.error("Ошибка создания конкурса: ", error);
      },
    });

  return { createContest, isLoadingCreationContext };
}
