import { FC } from "react";

import { Archive, PaperclipIcon, PlusIcon } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { chaptersTable } from "@db/schema";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useChapterCharactersFromFractal } from "@renderer/hooks/chapter/useChapterCharactersFromFractal";

export const FileCharacters: FC<{
  file: typeof chaptersTable.$inferSelect;
}> = ({ file }) => {
  const [animate] = useAutoAnimate();
  const { data: characters, isLoading } = useChapterCharactersFromFractal(file);

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

  if (!characters || characters.length === 0) {
    return (
      <div className="w-full flex flex-col gap-0.5 items-center text-text p-2 grow overflow-y-auto group/todo-menu relative">
        <div className="flex items-center mt-8 gap-2 text-sm text-secondary-sidebar-foreground">
          <PaperclipIcon
            size={18}
            className="stroke-secondary-sidebar-primary"
          />
          No characters yet.
        </div>
        <p className="text-xs mt-2 max-w-[250px] text-center mx-auto text-secondary-sidebar-foreground">
          Find your characters here and information about them.
        </p>
        <Button
          className="mt-4 text-xs flex items-center gap-2 px-2"
          size="md"
          //   onClick={() => setAddingNote(true)}
        >
          <PlusIcon
            size={16}
            strokeWidth={1.5}
            className="stroke-secondary-sidebar-primary-foreground"
          />
          Create note
        </Button>
        <Button
          className="absolute bottom-2 left-2 text-xs flex items-center gap-2 px-2 hover:bg-secondary-sidebar-primary-foreground/10"
          size="icon"
          variant="ghost"
          //   onClick={() => setArchiveTab((prev) => !prev)}
        >
          <Archive
            size={16}
            strokeWidth={1.5}
            className="stroke-secondary-sidebar-foreground"
          />
        </Button>
      </div>
    );
  }

  //   if (archiveTab) {
  //     return <FileArchivedNotes file={file} setArchiveTab={setArchiveTab} />;
  //   }

  return (
    <div className="flex w-full flex-col overflow-y-auto grow">
      <div className="flex flex-col gap-2 p-2 overflow-y-auto" ref={animate}>
        {/* {characters?.map((note) => <Note key={note.id} note={note} />)} */}
      </div>
    </div>
  );
};
