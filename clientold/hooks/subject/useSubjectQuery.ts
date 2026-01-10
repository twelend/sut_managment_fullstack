import { subjectService } from "@/features/Dashboard/Subject/subject.service";
import { SubjectApiResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface ApiResponse {
  data: SubjectApiResponse[] | { detail: string };
  headers: Record<string, string>;
}

export function useSubjectQuery() {
  const { data, isPending, error } = useQuery<ApiResponse>({
    queryKey: ["subjects"],
    queryFn: () => {
      return subjectService.get();
    },
    refetchOnWindowFocus: true,
  });
  return { data, isPending, error };
}
