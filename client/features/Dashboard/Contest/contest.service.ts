import { api } from "@/shared/api";
import { TypeContestSchema } from "./contest.schema";
import { tokenUtils } from "@/shared/utils/token.utils";

class ContestService {
  private getAuthHeaders(): Record<string, string> | undefined {
    const token = tokenUtils.getToken();
    if (!token) {
      return undefined;
    }
    return {
      Authorization: `Token ${token}`,
    };
  }

  public async create(body: TypeContestSchema) {
    const headers = this.getAuthHeaders();

    const response = await api.post<TypeContestSchema>(
      "/api/teacher/contests/create/",
      body,
      {
        headers,
      }
    );

    return response;
  }

  public async get(): Promise<{
    data:
      | Array<{
          id: number;
          title: string;
          description: string;
          is_active: boolean;
          newApplications: number;
          totalApplications: number;
        }>
      | { detail: string };
    headers: Record<string, string>;
  }> {
    const headers = this.getAuthHeaders();

    const response = await api.get<{
      data:
        | Array<{
            id: number;
            title: string;
            description: string;
            is_active: boolean;
            newApplications: number;
            totalApplications: number;
          }>
        | { detail: string };
      headers: Record<string, string>;
    }>("/api/teacher/contests/", {
      headers,
    });

    return response;
  }

  public async delete(id: number) {
    const headers = this.getAuthHeaders();
    const response = await api.delete(`/api/teacher/contests/${id}/`, {
      headers,
    });
    return response;
  }
}

export const contestService = new ContestService();
