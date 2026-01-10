import LoginPage from "@/features/Login/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Авторзация",
  description: "Авторизация в систему управления",
};

export default function Login() {
  return <LoginPage />;
}
