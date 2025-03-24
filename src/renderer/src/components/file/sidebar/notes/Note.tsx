import { notesTable } from "@db/schema";
import { BasicEditor } from "@renderer/components/editor/BasicEditor";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { useUpdateNote } from "@renderer/hooks/note/useUpdateNote";
import { getTimeFromNow } from "@renderer/lib/utils";
import { Archive, Ellipsis } from "lucide-react";
import { FC, useRef, useState } from "react";

export const Note: FC<{
  note: typeof notesTable.$inferSelect;
}> = ({ note }) => {
  const editor = useCreateEditor({ value: note.content });
  const [content, setContent] = useState(note.content);
  const titleRef = useRef<HTMLDivElement>(null);
  const { mutate: updateNote } = useUpdateNote();

  return (
    <DropdownMenu>
      <div
        className="group/note p-4 rounded-md relative shadow border bg-secondary-sidebar-primary border-secondary-sidebar-border hover:border-secondary-sidebar-foreground/20"
        onBlur={() =>
          updateNote({
            ...note,
            content,
            title: titleRef.current?.textContent || "no title",
          })
        }
      >
        <div className="flex flex-col">
          <div className="">
            <div className="flex justify-between items-start">
              <div
                ref={titleRef}
                contentEditable={true}
                className="ring-0 outline-none text-sm font-semibold text-secondary-sidebar-primary-foreground/80 pr-4 w-full"
                dangerouslySetInnerHTML={{ __html: note.title }}
              />
            </div>
          </div>
          <div className="mt-3">
            <BasicEditor
              editor={editor}
              setContent={(value) => {
                setContent(value);
              }}
              editorClassName="text-sm text-secondary-sidebar-foreground"
              placeholder="Start writing..."
            />
          </div>
          <div className="mt-2 ml-auto text-xs text-muted-foreground">
            {getTimeFromNow(note.updated_at)}
          </div>
        </div>
        <DropdownMenuTrigger className="p-1 rounded-md hover:bg-secondaryBackground text-muted-foreground absolute top-2 right-2">
          <Ellipsis size={16} strokeWidth={2} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 rounded-lg" align="start">
          <DropdownMenuItem
            onClick={() =>
              updateNote({ ...note, content, title, deleted_at: new Date() })
            }
          >
            <Archive className="text-muted-foreground" />
            <span>Archive note</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
};
