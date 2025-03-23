import { memo, useState, useEffect, useRef } from "react";
import type { NodeProps } from "reactflow";
import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import { FileText, Plus, List } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { useProjectNotes } from "@renderer/hooks/useProjectNotes";
import { currentProjectIdAtom } from "@renderer/routes/__root";
import { useAtomValue } from "jotai";
import { useCreateNote } from "@renderer/hooks/note/useCreateNote";
import type { InferSelectModel } from "drizzle-orm";
import { notesTable } from "@db/schema";
import { BasicEditor } from "@renderer/components/editor/BasicEditor";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import { useUpdateNote } from "@renderer/hooks/note/useUpdateNote";
import { deserialize } from "@renderer/db";

interface ContentNodeData {
  title: string;
  content: string;
  noteId?: number;
}

function ContentNode({ data }: NodeProps<ContentNodeData>): JSX.Element {
  const [title, setTitle] = useState(data.title || "");
  const [content, setContent] = useState(deserialize(data.content));
  const titleRef = useRef<HTMLDivElement>(null);
  const currentProjectId = useAtomValue(currentProjectIdAtom);
  const { data: notes } = useProjectNotes(currentProjectId as number);
  const { mutate: createNote } = useCreateNote(
    currentProjectId as number,
    null,
  );
  const { mutate: updateNote } = useUpdateNote();
  const editor = useCreateEditor({ value: content });

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.textContent = title;
    }
  }, [title]);

  const handleNewNote = (): void => {
    createNote({
      title: "New Note",
      content: "",
    });
  };

  const handleSelectNote = (
    note: InferSelectModel<typeof notesTable>,
  ): void => {
    data.title = note.title;
    data.content = note.content as string;
    data.noteId = note.id;
    setTitle(note.title);
    setContent(deserialize(note.content));
  };

  const handleContentUpdate = (newContent: string): void => {
    setContent(newContent);
    if (data.noteId) {
      updateNote({
        id: data.noteId,
        title,
        content: newContent,
      });
    }
  };

  const handleTitleUpdate = (newTitle: string): void => {
    setTitle(newTitle);
    if (data.noteId) {
      updateNote({
        id: data.noteId,
        title: newTitle,
        content,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Card className="w-64 shadow-md border-2 border-dashed hover:border-muted-foreground transition-colors bg-muted/30">
          <CardHeader className="p-3 pb-0">
            <div className="flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            {data.noteId ? (
              <div className="flex flex-col gap-2">
                <div
                  ref={titleRef}
                  contentEditable={true}
                  className="ring-0 outline-none text-sm font-semibold text-foreground/80 pr-4 w-full"
                  onInput={(e) =>
                    handleTitleUpdate(e.currentTarget.textContent || "")
                  }
                />
                <BasicEditor
                  editor={editor}
                  setContent={handleContentUpdate}
                  editorClassName="text-sm text-foreground min-h-[100px]"
                  placeholder="Start writing..."
                />
              </div>
            ) : (
              <div className="text-center">
                <h3 className="font-bold text-sm truncate">Content</h3>
                <p className="text-xs text-muted-foreground line-clamp-4 mt-1">
                  Click to add content
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleNewNote}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </DropdownMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DropdownMenuItem>
              <List className="h-4 w-4 mr-2" />
              Select Note
            </DropdownMenuItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-48">
            {notes?.map((note) => (
              <DropdownMenuItem
                key={note.id}
                onClick={() => handleSelectNote(note)}
              >
                {note.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default memo(ContentNode);
