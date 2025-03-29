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
import { ArchiveRestore, ArchiveX, Ellipsis, Paperclip } from "lucide-react";
import { FC } from "react";

export const ArchivedNote: FC<{
  note: typeof notesTable.$inferSelect;
}> = ({ note }) => {
  const editor = useCreateEditor({ value: note.content });

  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: updateNote } = useUpdateNote();

  return (
    <DropdownMenu>
      <div className="group/note rounded-md relative shadow border bg-background/5 border-secondary-sidebar-foreground/10 hover:border-secondary-sidebar-foreground/20">
        <div className="flex flex-col">
          <div className="border-b px-4 py-2 border-secondary-sidebar-foreground/10 flex justify-between items-center gap-2">
            <Paperclip size={16} className="shrink-0 text-muted-foreground" />
            <DropdownMenuTrigger
              className="p-0.5 rounded-md hover:bg-secondaryBackground text-muted-foreground"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Ellipsis size={16} strokeWidth={2} />
            </DropdownMenuTrigger>
          </div>
          <div className="mt-3 px-4">
            <h2 className="ring-0 outline-none py-2 text-md font-semibold text-secondary-sidebar-primary-foreground/80 pr-4 w-full">
              {note.title}
            </h2>
            <BasicEditor
              editor={editor}
              setContent={() => {}}
              editorClassName="text-sm text-secondary-sidebar-foreground pointer-events-none"
              placeholder="Start writing..."
            />
          </div>
          <div className="mt-2 ml-auto text-xs text-muted-foreground px-4">
            Created: {getTimeFromNow(note.updated_at)}
          </div>
          <div className="mt-2 ml-auto text-xs text-muted-foreground px-4 pb-2">
            Archived: {getTimeFromNow(note.deleted_at)}
          </div>
        </div>
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
