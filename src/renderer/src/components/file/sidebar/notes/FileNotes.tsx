import { FC, useState } from "react";

import { LightbulbIcon, PlusIcon } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { chaptersTable, notesTable } from "@db/schema";
import { useChapterNotes } from "@renderer/hooks/note/useChapterNotes";
import { NewNote } from "./NewNote";
import { Note } from "./Note";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export const FileNotes: FC<{ file: typeof chaptersTable.$inferSelect }> = ({
  file,
}) => {
  const [addingNote, setAddingNote] = useState(false);
  const [animate] = useAutoAnimate();
  const { data: notes, isLoading } = useChapterNotes(file?.id);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-2 items-center text-text p-2 grow overflow-y-auto group/todo-menu relative">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-full flex items-center gap-2 text-sm border rounded-md bg-background/10 text-secondary-sidebar-foreground border-secondary-sidebar-border h-24"
          />
        ))}
      </div>
    );
  }

  if ((!notes || notes.length === 0) && !addingNote) {
    return (
      <div className="w-full flex flex-col gap-0.5 items-center text-text p-2 grow overflow-y-auto group/todo-menu relative">
        <div className="flex items-center mt-8 gap-2 text-sm text-secondary-sidebar-foreground">
          <LightbulbIcon
            size={18}
            className="stroke-secondary-sidebar-primary"
          />
          No notes yet.
        </div>
        <p className="text-xs mt-2 max-w-[250px] text-center mx-auto text-secondary-sidebar-foreground">
          Notes are a great way to to keep track of ideas and thoughts and make
          sure you don&apos;t forget
        </p>
        <Button
          className="mt-4 text-xs flex items-center gap-2 px-2"
          size="md"
          onClick={() => setAddingNote(true)}
        >
          <PlusIcon
            size={16}
            strokeWidth={1.5}
            className="stroke-secondary-sidebar-primary-foreground"
          />
          Create note
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col overflow-y-auto grow" ref={animate}>
      <div className="flex flex-col gap-2 p-2 overflow-y-auto">
        {notes?.map((note) => (
          <Note key={note.id} note={note as typeof notesTable.$inferInsert} />
        ))}
      </div>
      {addingNote && (
        <div className="mt-auto p-2 pt-0">
          <NewNote file={file} setAddingNote={() => setAddingNote(false)} />
        </div>
      )}
      {!addingNote ? (
        <div className="p-2 mt-auto">
          <Button
            className=" text-xs flex items-center gap-2 px-2 ml-auto text-secondary-sidebar-foreground hover:text-secondary-sidebar-primary-foreground hover:bg-secondary-sidebar-primary-foreground/10"
            size="md"
            variant="ghost"
            onClick={() => setAddingNote(true)}
          >
            <PlusIcon
              size={16}
              strokeWidth={1.5}
              className="stroke-secondary-sidebar-primary-foreground"
            />
            Create note
          </Button>
        </div>
      ) : null}
    </div>
  );
};
