import { IForm } from "@/components/landing-components/RequestModal";
import { api } from "@/shared/api";
import { ContestApiResponse, SubjectApiResponse } from "@/types";

export class LandingService {
  async getSubjects(): Promise<{
    data: SubjectApiResponse[];
    headers: Record<string, string>;
  }> {
    return api.get<{
      data: SubjectApiResponse[];
      headers: Record<string, string>;
    }>("/api/landing/subjects/");
  }

  async getContests(): Promise<{
    data: ContestApiResponse[];
    headers: Record<string, string>;
  }> {
    return api.get<{
      data: ContestApiResponse[];
      headers: Record<string, string>;
    }>("/api/landing/contests/");
  }

  async sendRequest(
    body: IForm,
    type: string
  ): Promise<{
    data: IForm;
    headers: Record<string, string>;
  }> {
    return api.post<{
      data: IForm;
      headers: Record<string, string>;
    }>(`/api/apply/${type}/`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export const landingService = new LandingService();
