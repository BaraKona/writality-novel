import { FC } from "react";

import { Lightbulb } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { chaptersTable } from "@db/schema";
import { useArchivedNotes } from "@renderer/hooks/note/useArchivedNotes";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { DeletedNote } from "./DeletedNote";

export const FileArchivedNotes: FC<{
  file: typeof chaptersTable.$inferSelect;
  setArchiveTab: (value: boolean) => void;
}> = ({ file, setArchiveTab }) => {
  const [animate] = useAutoAnimate();
  const { data: archivedNotes, isLoading } = useArchivedNotes(file?.id);

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

  return (
    <div className="flex w-full flex-col overflow-y-auto grow" ref={animate}>
      <div className="flex flex-col gap-2 p-2 overflow-y-auto">
        <div className="p-4 rounded-md bg-sidebar-primary/40 text-secondary-sidebar-primary-foreground/70 font-light text-sm space-y-2 text-center">
          <div className="">
            Find your archived notes here. Explore, restore or delete them
            entirely
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {archivedNotes?.map((note) => (
            <DeletedNote key={note.id} note={note} />
          ))}
        </div>
      </div>
      <Button
        className="absolute bottom-2 left-2 text-xs flex items-center gap-2 px-2 hover:bg-secondary-sidebar-primary-foreground/10"
        size="icon"
        variant="ghost"
        onClick={() => setArchiveTab(false)}
      >
        <Lightbulb
          size={16}
          strokeWidth={1.5}
          className="stroke-secondary-sidebar-foreground"
        />
      </Button>
    </div>
  );
};
