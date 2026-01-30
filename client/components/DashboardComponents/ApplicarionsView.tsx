"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import {
  ApplicationItem,
  ContestApiResponse,
  SubjectApiResponse,
} from "@/types";
import { useApplicationsContestQuery } from "@/hooks/applications/useApplicationsQuery";
import { Spinner } from "../ui/spinner";
import { useApplicationMutation } from "@/hooks/applications/useApplicationMutation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRefbookQuery } from "@/hooks/refbook/useRefbookQuery";
import { applyTemplate } from "../TemplatesTextarea/applyTemplate";

interface ApplicationsViewProps {
  course?: SubjectApiResponse;
  competition?: ContestApiResponse;
  onBack: () => void;
}

export default function ApplicationsView({
  course,
  competition,
  onBack,
}: ApplicationsViewProps) {
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<"accept" | "reject">(
    "accept"
  );
  const [message, setMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "new" | "accepted" | "rejected"
  >("all");

  const [isSending, setIsSending] = useState(false);
  const [sendingStatus, setSendingStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const title = course?.title || competition?.title || "Заявки";
  const type = !course ? "contest" : "subject";

  const { applicationsItems, isLoadingApplications } =
    useApplicationsContestQuery(
      competition?.id || course?.id || 0,
      filterStatus,
      type
    );

  const applications = applicationsItems?.items ?? [];
  console.log(applicationsItems);
  const counts = applicationsItems?.counts;

  const { data, isPending } = useRefbookQuery();

  const templates = Array.isArray(data?.data) ? data?.data : [];

  const { acceptApplication, isLoadingAccept } = useApplicationMutation(type);

  console.log(selectedApplication?.id);

  const handleActionClick = (
    app: ApplicationItem,
    action: "accept" | "reject"
  ) => {
    setSelectedApplication(app);
    setDialogAction(action);
    setMessage("");
    setSendingStatus("idle");
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (selectedApplication && message.trim()) {
      setIsSending(true);
      setSendingStatus("loading");

      try {
        await acceptApplication({
          id: selectedApplication.id,
          action: dialogAction,
          message,
        });

        setSendingStatus("success");
        setDialogOpen(false);
        setSelectedApplication(null);
        setMessage("");
        setIsSending(false);
      } catch (error) {
        console.error("Error sending email:", error);
        setSendingStatus("error");
        setIsSending(false);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground mt-1">
            {type === "contest" ? "Заявки на занятие" : "Заявки на конкурс"}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <Tabs
          value={filterStatus}
          onValueChange={(v) => setFilterStatus(v as any)}
        >
          <TabsList>
            <TabsTrigger value="all">Все ({counts?.all ?? 0})</TabsTrigger>
            <TabsTrigger value="new">Новые ({counts?.new ?? 0})</TabsTrigger>
            <TabsTrigger value="accepted">
              Принятые ({counts?.accepted ?? 0})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Отклоненные ({counts?.rejected ?? 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoadingApplications ? (
        <div className="h-[500px] flex justify-center items-center">
          <Spinner style={{ width: "80px", height: "80px" }} />
        </div>
      ) : (
        <div className="space-y-3">
          {applications.length > 0 ? (
            applications.map((app: any) => (
              <Card
                key={app.id}
                className="hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {app.child_name}
                        </h3>
                        <Badge
                          variant={
                            app.status === "new"
                              ? "default"
                              : app.status === "accepted"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {app.status === "new" && "Новая"}
                          {app.status === "accepted" && "Принята"}
                          {app.status === "rejected" && "Отклонена"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{app.email}</span>
                        </div>
                        <div>Телефон: {app.phone}</div>

                        {app.parent_name && (
                          <div className="col-span-2">
                            Родитель: {app.parent_name}
                          </div>
                        )}

                        <div className="col-span-2">Дата: {app.appliedAt}</div>
                      </div>
                    </div>

                    {app.status === "new" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleActionClick(app, "accept")}
                        >
                          Принять
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleActionClick(app, "reject")}
                        >
                          Отклонить
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Нет заявок по выбранному фильтру
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "accept"
                ? "Принять заявку"
                : "Отклонить заявку"}
            </DialogTitle>
            <DialogDescription>
              Для {selectedApplication?.child_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="">
              <Select
                onValueChange={(templateId) => {
                  const template = templates?.find(
                    (t) => t.id === Number(templateId)
                  );

                  if (!template) return;

                  const text = applyTemplate(
                    template.content,
                    selectedApplication
                  );

                  setMessage(text);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите шаблон" />
                </SelectTrigger>

                <SelectContent>
                  {templates &&
                    templates.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Текст письма ({selectedApplication?.email})
              </label>
              <Textarea
                placeholder={
                  dialogAction === "accept"
                    ? "Напишите подтверждение..."
                    : "Укажите причину отказа..."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                disabled={isSending}
              />
            </div>

            {sendingStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Письмо отправлено!</span>
              </div>
            )}

            {sendingStatus === "error" && (
              <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Ошибка отправки</span>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isSending}
            >
              Отмена
            </Button>

            <Button
              onClick={handleConfirmAction}
              variant={dialogAction === "accept" ? "default" : "destructive"}
              disabled={
                isSending || !message.trim() || sendingStatus === "success"
              }
            >
              {isSending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {sendingStatus === "success"
                ? "Отправлено"
                : dialogAction === "accept"
                ? "Принять"
                : "Отклонить"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
