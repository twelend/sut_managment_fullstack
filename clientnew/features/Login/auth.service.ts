import { api } from "@/shared/api";
import { tokenUtils } from "@/shared/utils/token.utils";
import { LoginResponse } from "@/types";
import { TypeLoginSchema } from "./login.schema";


class AuthService {
  public async login(body: TypeLoginSchema) {
    const headers = undefined;

    const response = await api.post<LoginResponse>("/api/teacher/login/", body, { headers });
    const token = response.data?.data.token;
    
    if (token) {
      tokenUtils.setToken(token);
    } else {
      console.log('Токен не найден в ответе');
    }

    return response;
  }

  public async logout() {
    tokenUtils.removeToken();
    return window.location.reload();
  }

}

export const authService = new AuthService();