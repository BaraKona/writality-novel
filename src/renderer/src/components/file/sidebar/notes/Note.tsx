import { notesTable } from "@db/schema";
import { BasicEditor } from "@renderer/components/editor/BasicEditor";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import { useUpdateNote } from "@renderer/hooks/note/useUpdateNote";
import { getTimeFromNow } from "@renderer/lib/utils";
import { FC, useState } from "react";

export const Note: FC<{
  note: typeof notesTable.$inferSelect;
}> = ({ note }) => {
  const editor = useCreateEditor({ value: note.content });
  const [content, setContent] = useState(note.content);
  const [title, setTitle] = useState(note.title);
  const { mutate: updateNote } = useUpdateNote();

  return (
    <div
      className="p-4 rounded-md relative shadow border bg-secondary-sidebar-primary border-secondary-sidebar-border"
      onBlur={() => updateNote({ ...note, content, title })}
    >
      <div className="group/note flex flex-col">
        <div className="">
          <div className="flex justify-between items-start">
            <h2
              contentEditable={true}
              className="ring-0 outline-none text-sm font-semibold text-secondary-sidebar-primary-foreground/80"
              onInput={(e) => setTitle((e.target as HTMLElement).innerText)}
            >
              {note.title}
            </h2>
          </div>
        </div>
        <div className="mt-3">
          <BasicEditor
            editor={editor}
            setContent={(value) => setContent(value)}
            editorClassName="text-sm text-secondary-sidebar-foreground"
            placeholder="Start writing..."
          />
        </div>
        <div className="mt-2 ml-auto text-xs text-muted-foreground">
          {getTimeFromNow(note.updated_at)}
        </div>
      </div>
    </div>
  );
};
