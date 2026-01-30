import { IForm } from "@/components/landing-components/RequestModal";
import { landingService } from "@/features/Landing/landing.service";
import { ContestApiResponse, SubjectApiResponse } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetSubjects() {
  const { data, isPending, error } = useQuery({
    queryKey: ["landing", "subjects"],
    queryFn: async (): Promise<SubjectApiResponse[]> => {
      const res = await landingService.getSubjects();
      return res.data ?? [];
    },
    refetchOnWindowFocus: true,
  });

  return { data: data ?? [], isPending, error };
}

export function useGetContests() {
  const { data, isPending, error } = useQuery({
    queryKey: ["landing", "contests"],
    queryFn: async (): Promise<ContestApiResponse[]> => {
      const res = await landingService.getContests();
      return res.data ?? [];
    },
    refetchOnWindowFocus: true,
  });

  return { data: data ?? [], isPending, error };
}

export function useCreateRequest() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["request"],
    mutationFn: async ({ body, type }: { body: IForm; type: string }) => {
      return await landingService.sendRequest(body, type);
    },
    onSuccess: () => {
      toast.success("Заявка успешно отправлена");
      queryClient.invalidateQueries({
        queryKey: ["subjects", "contests", "landing", "applications"],
      });
    },
    onError: () => {
      toast.error("Не удалось отправить заявку");
    },
  });

  return { mutateAsync, isPending };
}
