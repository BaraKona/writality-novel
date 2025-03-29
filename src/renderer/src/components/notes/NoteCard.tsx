import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@renderer/components/ui/button";
import {
  DoorOpen,
  MoreHorizontal,
  Share,
  Trash2,
  FileSignature,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { notesTable } from "@db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { deserialize } from "@renderer/db";
import { Value } from "@udecode/plate";
import { getTimeFromNow } from "@renderer/lib/utils";

interface NoteCardProps {
  note: InferSelectModel<typeof notesTable> & {
    chapter?: { id: number; name: string } | null;
  };
  onDelete: () => void;
  onUpdate: (
    note: Omit<InferSelectModel<typeof notesTable>, "content"> & {
      content: Value;
    },
  ) => void;
  onClick: () => void;
  isSelected: boolean;
}

export function NoteCard({
  note,
  onDelete,
  onUpdate,
  onClick,
  isSelected,
}: NoteCardProps): JSX.Element {
  const [title, setTitle] = useState(note.title);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.textContent = title;
    }
  }, [title]);

  const handleTitleChange = (newTitle: string): void => {
    setTitle(newTitle);
    onUpdate({
      ...note,
      title: newTitle,
      content: deserialize(note.content) as Value,
    });
  };

  return (
    <div
      className={`group relative bg-card col-span-1 flex flex-col basis-[320px] rounded-xl border ${isSelected ? "border-primary" : "hover:border-foreground/25"}`}
    >
      <div className="flex items-center p-2 justify-end gap-2">
        {note.chapter_name && (
          <Link
            to="/chapters/$chapterId"
            params={{ chapterId: note.chapter_id?.toString() || "" }}
            className="flex items-center border gap-2 text-xs self-start px-2 py-1 rounded-md text-primary hover:text-primary/80 cursor-pointer"
          >
            <FileText size={16} className="shrink-0" />
            <span>{note.chapter_name}</span>
          </Link>
        )}
        <Button
          variant="outline"
          size="icon"
          className="p-0.75"
          onClick={onClick}
        >
          <DoorOpen size={16} className="shrink-0" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="p-0.75">
              <MoreHorizontal size={16} className="shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>
              <Share size={16} className="mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="max-w-fit p-4 font-serif text-xl font-medium">
        <div
          ref={titleRef}
          contentEditable
          className="ring-0 outline-none line-clamp-2"
          onInput={(e) => handleTitleChange(e.currentTarget.textContent || "")}
        />
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t p-4">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-2 text-xs text-sidebar-primary ml-auto">
            <FileSignature size={16} className="shrink-0" />
            <span className="">{getTimeFromNow(note.updated_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
