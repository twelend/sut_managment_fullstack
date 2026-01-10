"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import ApplicationsView from "./ApplicarionsView";
import { useContestQuery } from "@/hooks/contest/useContestQuery";
import { ContestApiResponse } from "@/types";
import { useContestMutation } from "@/hooks/contest/useConestMutation";
import { useContestDelete } from "@/hooks/contest/useContestDelete";
import { Spinner } from "../ui/spinner";

export default function ContestSection() {
  const [selectedCompetition, setSelectedCompetition] =
    useState<ContestApiResponse | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContestApiResponse | null>(
    null
  );

  const { data, isPending, error } = useContestQuery();
  const { createContest, isLoadingCreationContext } = useContestMutation();
  const { deleteContest, isLoadingDeleteContest } = useContestDelete();

  const handleCreateCompetition = async () => {
    if (newName.trim()) {
      await createContest({
        values: {
          title: newName.trim(),
          description: newDescription.trim() || "",
        },
      });
      setNewName("");
      setNewDescription("");
      setCreateDialogOpen(false);
    }
  };

  const handleDeleteCompetition = async (id: number) => {
    if (deleteTarget) {
      await deleteContest(id);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  if (selectedCompetition) {
    return (
      <ApplicationsView
        competition={selectedCompetition}
        onBack={() => setSelectedCompetition(null)}
      />
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Конкурсы</h2>
          <p className="text-muted-foreground">
            Управление конкурсами и заявками участников
          </p>
        </div>
        <Button
          className="gap-2 w-[200px]"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Создать конкурс
        </Button>
      </div>

      <div className="grid gap-4">
        {isPending ? (
          <div className="h-[500px] flex justify-center items-center">
            <Spinner style={{ width: "80px", height: "80px" }} />
          </div>
        ) : Array.isArray(data?.data) ? (
          data.data.map((competition) => (
            <Card
              key={competition.id}
              className="hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {competition.title}
                      </h3>
                      <Badge
                        variant={
                          competition.newApplications > 0
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        +{competition.newApplications}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Всего заявок: {competition.totalApplications}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCompetition(competition)}
                      className="gap-2"
                    >
                      Просмотр заявок
                      <ChevronRight className="w-4 h-4" />
                    </Button>

                    <Button
                      disabled={isLoadingDeleteContest}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setDeleteTarget(competition);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">{data?.data.detail}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Модалка создания конкурса */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать новый конкурс</DialogTitle>
            <DialogDescription>
              Добавьте информацию о новом конкурсе
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название конкурса</Label>
              <Input
                id="title"
                placeholder="Например: Лего. Эстафета..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание (опционально)</Label>
              <Textarea
                id="description"
                placeholder="Описание конкурса..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-4 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              onClick={handleCreateCompetition}
              disabled={!newName.trim()}
            >
              Создать
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модалка удаления конкурса */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить конкурс</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить конкурс "{deleteTarget?.title}"?
              Это действие не может быть отменено.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                handleDeleteCompetition(deleteTarget ? deleteTarget.id : 0)
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
