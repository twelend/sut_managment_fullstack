"use client";

import { useRef } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ITemplates } from "@/types";

interface Props {
  content: string;
  setContent: (content: string) => void;
  templates: ITemplates[];

  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
}

export function TextareaUpgraded({
  content = "",
  setContent,
  label = "Название",
  name = "name",
  placeholder = "Введите название...",
  rows = 6,
  templates = [],
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const insertAtCursor = (insertText: string) => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newText = content.slice(0, start) + insertText + content.slice(end);

    setContent(newText);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + insertText.length,
        start + insertText.length
      );
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="space-y-2">
        <div className="flex gap-1 items-center">
          {templates &&
            templates.map((item, key) => (
              <Button
                key={key}
                onClick={() => insertAtCursor(item.template)}
                className="p-1 h-fit"
              >
                <span className="text-xs p-0.5">{item.title}</span>
              </Button>
            ))}
        </div>
        <Textarea
          ref={textareaRef}
          id={name}
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={rows}
        />
      </div>
    </div>
  );
}
