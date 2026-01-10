"use client";

import { BookOpen, Trophy, LogOut, Loader2, NotebookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useLogoutMutation } from "@/hooks/auth/useLogoutMutation";

interface SidebarProps {
  activeSection: "courses" | "subject" | "refbook";
  onSectionChange: (section: "courses" | "subject" | "refbook") => void;
}

export default function Sidebar({
  activeSection,
  onSectionChange,
}: SidebarProps) {
  const { logout, isLoadingLogout } = useLogoutMutation();

  const handleLogout = async () => {
    logout();
    redirect("/");
  };

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">
          Панель Управления
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Управление занятиями и конкурсами
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant={activeSection === "courses" ? "default" : "ghost"}
          className="w-full justify-start gap-2"
          onClick={() => onSectionChange("courses")}
        >
          <BookOpen className="w-5 h-5" />
          <span>Занятия</span>
        </Button>

        <Button
          variant={activeSection === "subject" ? "default" : "ghost"}
          className="w-full justify-start gap-2"
          onClick={() => onSectionChange("subject")}
        >
          <Trophy className="w-5 h-5" />
          <span>Конкурсы</span>
        </Button>

        <Button
          variant={activeSection === "refbook" ? "default" : "ghost"}
          className="w-full justify-start gap-2"
          onClick={() => onSectionChange("refbook")}
        >
          <NotebookText className="w-5 h-5" />
          <span>Справочник</span>
        </Button>
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          onClick={() => handleLogout()}
          variant="outline"
          className="w-full justify-start gap-2 bg-transparent"
        >
          {isLoadingLogout ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <>
              {" "}
              <LogOut className="w-5 h-5" />
              <span>Выход</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
