import { notesTable } from "@db/schema";
import { BasicEditor } from "@renderer/components/editor/BasicEditor";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { useDeleteNote } from "@renderer/hooks/note/useDeleteNote";
import { useUpdateNote } from "@renderer/hooks/note/useUpdateNote";
import { getTimeFromNow } from "@renderer/lib/utils";
import { ArchiveRestore, ArchiveX, Ellipsis } from "lucide-react";
import { FC } from "react";

export const ArchivedNote: FC<{
  note: typeof notesTable.$inferSelect;
  chapterId: number;
}> = ({ note, chapterId }) => {
  const editor = useCreateEditor({ value: note.content });

  const { mutate: deleteNote } = useDeleteNote(chapterId);
  const { mutate: updateNote } = useUpdateNote();

  return (
    <DropdownMenu>
      <div className="group/note p-4 rounded-md relative shadow border bg-secondary-sidebar-primary border-secondary-sidebar-border">
        <div className="flex flex-col">
          <div className="">
            <div className="flex justify-between items-start">
              <h2 className="ring-0 outline-none text-sm font-semibold text-secondary-sidebar-primary-foreground/80 pr-4 w-full">
                {note.title}
              </h2>
            </div>
          </div>
          <div className="mt-3">
            <BasicEditor
              editor={editor}
              setContent={() => {}}
              editorClassName="text-sm text-secondary-sidebar-foreground pointer-events-none"
              placeholder="Start writing..."
            />
          </div>
          <div className="mt-2 ml-auto text-xs text-muted-foreground">
            Created: {getTimeFromNow(note.updated_at)}
          </div>
          <div className="mt-2 ml-auto text-xs text-muted-foreground">
            Archived: {getTimeFromNow(note.deleted_at)}
          </div>
        </div>
        <DropdownMenuTrigger className="p-1 rounded-md hover:bg-secondaryBackground text-muted-foreground absolute top-2 right-2">
          <Ellipsis size={16} strokeWidth={2} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 rounded-lg" align="start">
          <DropdownMenuItem
            onClick={() => updateNote({ ...note, deleted_at: null })}
          >
            <ArchiveRestore className="text-muted-foreground" />
            <span>Restore</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteNote(note.id)}>
            <ArchiveX className="text-muted-foreground" />
            <span>Permanently remove</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
};
