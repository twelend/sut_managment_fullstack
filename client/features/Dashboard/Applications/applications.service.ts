import { api } from "@/shared/api";
import { tokenUtils } from "@/shared/utils/token.utils";
import { ApplicationsApiResponse } from "@/types";

class ApplicationsService {
  private getAuthHeaders(): Record<string, string> | undefined {
    const token = tokenUtils.getToken();
    if (!token) return undefined;

    return {
      Authorization: `Token ${token}`,
    };
  }

  public async get(endpoint: string): Promise<ApplicationsApiResponse> {
    const headers = this.getAuthHeaders();

    const response = await api.get<{data: ApplicationsApiResponse}>(endpoint, {
      headers,
    });

    return response.data;
  }

  public async accept(
    endpoint: string,
    body: { action: string; message: string }
  ) {
    const headers = this.getAuthHeaders();
    const response = await api.post(endpoint, body, {
      headers,
    });
    return response;
  }
}

export const applicationsService = new ApplicationsService();
