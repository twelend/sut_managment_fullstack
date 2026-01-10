import { useQuery } from "@tanstack/react-query";
import { applicationsService } from "@/features/Dashboard/Applications/applications.service";
import { ApplicationsApiResponse } from "@/types";

export function useApplicationsContestQuery(
  contestId: number,
  statusQuery: "all" | "new" | "accepted" | "rejected" = "all",
  type: 'subject' | 'contest' 
) {
  const { data: applicationsItems, isLoading: isLoadingApplications } =
    useQuery<ApplicationsApiResponse>({
      queryKey: ["applications", contestId, statusQuery],
      queryFn: async () => {
        const url =
          statusQuery && statusQuery !== "all"
            ? `/api/teacher/${type}/${contestId}/applications/?status=${statusQuery}`
            : `/api/teacher/${type}/${contestId}/applications/`;

        return await applicationsService.get(url);
      },
      enabled: contestId > 0,
    });

  return { applicationsItems, isLoadingApplications };
}
