import { contestService } from "@/features/Dashboard/Contest/contest.service";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export function useContestDelete() {
  const queryClient = useQueryClient();
  const {
    mutateAsync: deleteContest,
    isPending: isLoadingDeleteContest,
    error,
  } = useMutation({
    mutationKey: ["delete_contest"],
    mutationFn: (id: number) => {
      return contestService.delete(id);
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["contests"] });
      toast(`Конкурс успешно удален!`);
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ["contests"] });
      toast(`${error.message}`);
    },
  });

  return { deleteContest, isLoadingDeleteContest, error };
}
