import { refbookService } from "@/features/Dashboard/Refbook/refbook.service";
import { RefbookTemplate } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface ApiResponse {
  data: RefbookTemplate[] | { detail: string };
  headers: Record<string, string>;
}

export function useRefbookQuery() {
  const { data, isPending, error } = useQuery<ApiResponse>({
    queryKey: ["refbook"],
    queryFn: () => refbookService.get(),
    refetchOnWindowFocus: true,
  });

  return { data, isPending, error };
}

