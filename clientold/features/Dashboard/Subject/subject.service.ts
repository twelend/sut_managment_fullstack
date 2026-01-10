import { api } from "@/shared/api";
import { TypeSubjectSchema } from "./subject.schema";
import { tokenUtils } from "@/shared/utils/token.utils";
import { SubjectApiResponse } from "@/types";

class SubjectService {
  private getAuthHeaders(): Record<string, string> | undefined {
    const token = tokenUtils.getToken();
    if (!token) {
      return undefined;
    }

    return {
      Authorization: `Token ${token}`,
    };
  }

  public async get(): Promise<{
    data: SubjectApiResponse[] | { detail: string };
    headers: Record<string, string>;
  }> {
    const headers = this.getAuthHeaders();

    return api.get<{
      data: SubjectApiResponse[] | { detail: string };
      headers: Record<string, string>;
    }>("/api/teacher/subjects/", {
      headers,
    });
  }

  public async create(body: TypeSubjectSchema) {
    const headers = this.getAuthHeaders();

    return api.post<TypeSubjectSchema>("/api/teacher/subjects/create/", body, {
      headers,
    });
  }

  public async delete(id: number) {
    const headers = this.getAuthHeaders();
    return api.delete(`/api/teacher/subjects/${id}/`, {
      headers,
    });
  }
}

export const subjectService = new SubjectService();
