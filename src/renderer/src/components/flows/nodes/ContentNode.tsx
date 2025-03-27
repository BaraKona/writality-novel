import { memo, useRef } from "react";
import type { NodeProps } from "reactflow";
import { List, Ellipsis, Paperclip } from "lucide-react";
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
import { Button } from "@renderer/components/ui/button";
import { useDebounce } from "@renderer/hooks/useDebounce";
import { Value } from "@udecode/plate";
import { useNote } from "@renderer/hooks/note/useNote";
import { useReactFlow } from "reactflow";
import EmptyContentNode from "./EmptyContentNode";

interface ContentNodeData {
  title: string;
  content: string;
  noteId?: number;
}

function ContentNode({ data, id }: NodeProps<ContentNodeData>): JSX.Element {
  const titleRef = useRef<HTMLDivElement>(null);
  const currentProjectId = useAtomValue(currentProjectIdAtom);
  const { data: notes } = useProjectNotes(currentProjectId as number);
  const { data: note } = useNote(data.noteId as number);
  const { setNodes, getNodes } = useReactFlow();

  const { mutate: createNote } = useCreateNote(
    currentProjectId as number,
    null,
  );
  const { mutate: updateNote } = useUpdateNote();

  const editor = useCreateEditor({ value: note?.content as Value });

  const handleNewNote = (): void => {
    createNote({
      title: "New Note",
      content: "",
    });

    handleSelectNote(
      notes?.[notes.length - 1] as InferSelectModel<typeof notesTable>,
    );
  };

  const handleSelectNote = (
    note: InferSelectModel<typeof notesTable>,
  ): void => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              noteId: note.id,
            },
          };
        }
        return node;
      }),
    );
  };

  const handleContentUpdate = (newContent: Value): void => {
    if (data.noteId && note) {
      updateNote({
        ...note,
        content: newContent,
      });
    }
  };

  const handleTitleUpdate = (newTitle: string): void => {
    if (data.noteId && note) {
      updateNote({
        ...note,
        title: newTitle,
      });
    }
  };

  const debounceUppdateNode = useDebounce(
    (content: Value) => handleContentUpdate(content),
    1000,
  );

  // Get all note IDs currently in use in the fractal
  const usedNoteIds = getNodes()
    .filter((node) => node.type === "contentNode")
    .map((node) => (node.data as ContentNodeData).noteId)
    .filter((id): id is number => id !== undefined);

  if (!note) {
    return (
      <EmptyContentNode
        handleNewNote={handleNewNote}
        handleSelectNote={handleSelectNote}
        currentProjectId={currentProjectId as number}
        data={{ noteId: data.noteId as number }}
        usedNoteIds={usedNoteIds}
      />
    );
  }

  return (
    <div className="w-64 bg-card max-h-96 overflow-y-auto cursor-grab rounded-xl flex flex-col gap-2 border-2 hover:border-foreground/25 transition-colors cursor-pointer">
      <div className="w-full border-b flex items-center px-2 cursor-grab">
        <Paperclip size={14} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="ml-auto">
            <Button variant="ghost" size="icon">
              <Ellipsis size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <DropdownMenuItem>
                  <List className="h-4 w-4 mr-2" />
                  Change Note
                </DropdownMenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                className="w-48 max-h-64 overflow-y-auto"
              >
                {notes
                  ?.filter((note) => !usedNoteIds.includes(note.id))
                  .map((note) => (
                    <DropdownMenuItem
                      key={note.id}
                      className="items-start"
                      onClick={() => handleSelectNote(note)}
                    >
                      <Paperclip size={15} className="pt-1" />
                      {note.title}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className="flex flex-col gap-2 pb-2 nodrag rounded-xl cursor-default px-2 cursor-default overflow-y-auto nowheel"
        id="editor-wrapper"
      >
        <h2
          ref={titleRef}
          contentEditable={true}
          className="ring-0 outline-none text-md font-semibold text-foreground/80 pr-4 w-full"
          dangerouslySetInnerHTML={{ __html: note?.title || "" }}
          onBlur={(e) => handleTitleUpdate(e.currentTarget.textContent || "")}
        />
        <BasicEditor
          editor={editor}
          setContent={(content) => debounceUppdateNode(content)}
          editorClassName="text-sm text-foreground min-h-[100px] p-0"
          placeholder="Start writing..."
        />
      </div>
    </div>
  );
}

export default memo(ContentNode);
