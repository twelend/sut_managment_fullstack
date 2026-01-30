"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { useRefbookQuery } from "@/hooks/refbook/useRefbookQuery";
import { useRefbookMutation } from "@/hooks/refbook/useRefbookMutation";
import { useRefbookDelete } from "@/hooks/refbook/useRefbookDelete";
import { ITemplates, RefbookTemplate } from "@/types";
import { TextareaUpgraded } from "../TemplatesTextarea/TextareaUpgraded";

export default function RefbookSection() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<RefbookTemplate | null>(
    null
  );

  const { data, isPending } = useRefbookQuery();
  const { createTemplate, isCreatingTemplate } = useRefbookMutation();
  const { deleteTemplate, isDeletingTemplate } = useRefbookDelete();

  const templates = Array.isArray(data?.data) ? data?.data : [];

  const handleCreateTemplate = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      return;
    }

    await createTemplate({
      values: {
        title: newTitle.trim(),
        content: newContent.trim(),
      },
    });

    setNewTitle("");
    setNewContent("");
    setCreateDialogOpen(false);
  };

  const handleDeleteTemplate = async (id: number) => {
    await deleteTemplate(id);
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const templatesList: ITemplates[] = [
    {
      title: "Имя родителя",
      template: "{parent_name}",
    },
    {
      title: "Имя ребенка",
      template: "{child_name}",
    },
    {
      title: "Email",
      template: "{email}",
    },
    {
      title: "Возраст",
      template: "{age}",
    },
    {
      title: "Номер",
      template: "{phone}",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Шаблонные ответы
          </h2>
          <p className="text-muted-foreground">
            Создавайте и храните быстрые ответы для писем родителям
          </p>
        </div>
        <Button
          className="gap-2 w-[220px]"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Добавить шаблон
        </Button>
      </div>

      {isPending ? (
        <div className="h-[500px] flex justify-center items-center">
          <Spinner style={{ width: "80px", height: "80px" }} />
        </div>
      ) : templates && templates.length > 0 ? (
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        {template.title}
                      </h3>
                      {(template.updated_at || template.created_at) && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {(template.updated_at &&
                            template.updated_at.split("T")) ||
                            (template.created_at &&
                              template.created_at.split("T")[0])}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {template.content}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    size="sm"
                    disabled={isDeletingTemplate}
                    onClick={() => {
                      setDeleteTarget(template);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-10 text-center space-y-2">
            <p className="text-foreground font-medium">
              У вас пока нет сохранённых шаблонов.
            </p>
            <p className="text-muted-foreground text-sm">
              Нажмите «Добавить шаблон», чтобы создать первый быстрый ответ.
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новый шаблон ответа</DialogTitle>
            <DialogDescription>
              Укажите название и текст шаблона, чтобы быстро отвечать родителям.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-title">Название</Label>
              <Input
                id="template-title"
                placeholder="Например: Ответ на заявку"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <TextareaUpgraded
              label="Текст шаблона"
              content={newContent}
              setContent={setNewContent}
              name="template-content"
              templates={templatesList}
            />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setNewContent("");
                setNewTitle("");
                setCreateDialogOpen(false);
              }}
            >
              Отмена
            </Button>
            <Button
              onClick={handleCreateTemplate}
              disabled={
                !newTitle.trim() || !newContent.trim() || isCreatingTemplate
              }
            >
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить шаблон</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить шаблон «{deleteTarget?.title}»?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              disabled={!deleteTarget || isDeletingTemplate}
              onClick={() =>
                deleteTarget ? handleDeleteTemplate(deleteTarget.id) : null
              }
            >
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
