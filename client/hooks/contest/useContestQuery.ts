import { contestService } from "@/features/Dashboard/Contest/contest.service";
import { ContestApiResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface ApiResponse {
  data: ContestApiResponse[] | { detail: string };
  headers: Record<string, string>;
}

export function useContestQuery() {
  const { data, isPending, error } = useQuery<ApiResponse>({
    queryKey: ["contests"],
    queryFn: () => {
      return contestService.get();
    },
    refetchOnWindowFocus: true,
  });
  return { data, isPending, error };
}
