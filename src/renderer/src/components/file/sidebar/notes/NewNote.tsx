import { chaptersTable } from "@db/schema";
import { BasicEditor } from "@renderer/components/editor/BasicEditor";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import { Button } from "@renderer/components/ui/button";
import { useCreateNote } from "@renderer/hooks/note/useCreateNote";
import { currentProjectIdAtom } from "@renderer/routes/__root";
import { useAtomValue } from "jotai";
import { Save } from "lucide-react";
import { FC, useState } from "react";

export const NewNote: FC<{
  file: typeof chaptersTable.$inferSelect;
  setAddingNote: () => void;
}> = ({ file, setAddingNote }) => {
  const currentProjectId = useAtomValue(currentProjectIdAtom);
  const [name, setName] = useState("New note");
  const [content, setContent] = useState([]);

  const editor = useCreateEditor({});

  const { mutate } = useCreateNote(currentProjectId, file.id);

  const handleSave = (): void => {
    if (!content) {
      setAddingNote();
      return;
    }

    mutate({
      title: name,
      content,
    });

    setAddingNote();
  };

  return (
    <div className="p-4 rounded-lg relative shadow border border-primary-foreground/20 bg-background hover:border-foreground/20">
      <div className="group/note">
        <div className="flex justify-between items-start">
          <h2
            contentEditable={true}
            className="ring-0 outline-none text-sm font-semibold"
            onInput={(e) => setName((e.target as HTMLElement).innerText)}
          >
            New Note
          </h2>
        </div>
        <div className="mt-3">
          <BasicEditor
            editor={editor}
            setContent={(value) => setContent(value)}
            editorClassName="text-sm"
            placeholder="Start writing..."
          />
        </div>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="absolute bottom-2 right-2 cursor-pointer"
        onClick={handleSave}
      >
        <Save size={16} />
      </Button>
    </div>
  );
};
