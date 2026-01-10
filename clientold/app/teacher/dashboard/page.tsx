import DashboardPage from "@/features/Dashboard/DashboardPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Дашборд",
  description: "Система управления",
};

export default function Dashboard() {
  return <DashboardPage />;
}
