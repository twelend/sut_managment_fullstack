import { RefbookTemplate } from "@/types";
import { api } from "@/shared/api";
import { TypeRefbookSchema } from "./refbook.schema";
import { tokenUtils } from "@/shared/utils/token.utils";

class RefbookService {
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
    data: RefbookTemplate[] | { detail: string };
    headers: Record<string, string>;
  }> {
    const headers = this.getAuthHeaders();
    return api.get<{
      data: RefbookTemplate[] | { detail: string };
      headers: Record<string, string>;
    }>("/api/teacher/refbook/", {
      headers,
    });
  }

  public async create(body: TypeRefbookSchema) {
    const headers = this.getAuthHeaders();
    return api.post<TypeRefbookSchema>(
      "/api/teacher/refbook/create/",
      body,
      {
        headers,
      }
    );
  }

  public async delete(id: number) {
    const headers = this.getAuthHeaders();
    return api.delete(`/api/teacher/refbook/${id}/`, {
      headers,
    });
  }
}

export const refbookService = new RefbookService();

