import { createLazyFileRoute } from "@tanstack/react-router";
import { useProjectNotes } from "@renderer/hooks/useProjectNotes";
import { currentProjectIdAtom } from "@renderer/routes/__root";
import { useAtomValue } from "jotai";
import { Input } from "@renderer/components/ui/input";
import { Button } from "@renderer/components/ui/button";
import { Plus, Search, DoorClosed, Save } from "lucide-react";
import { useCreateNote } from "@renderer/hooks/note/useCreateNote";
import { useDeleteNote } from "@renderer/hooks/note/useDeleteNote";
import { useState, useRef } from "react";
import { useUpdateNote } from "@renderer/hooks/note/useUpdateNote";
import { notesTable } from "@db/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialogue";
import { BasicEditor } from "@renderer/components/editor/BasicEditor";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import { deserialize } from "@renderer/db";
import { Value } from "@udecode/plate";
import { NoteCard } from "@renderer/components/notes/NoteCard";

import "reactflow/dist/style.css";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export const Route = createLazyFileRoute("/world/notes")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const currentProjectId = useAtomValue(currentProjectIdAtom);
  const { data: notes, isLoading } = useProjectNotes(
    currentProjectId as number,
  );
  const { mutate: createNote } = useCreateNote(
    currentProjectId as number,
    null,
  );
  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: updateNote } = useUpdateNote();
  const [content, setContent] = useState<Value | null>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const [selectedNote, setSelectedNote] = useState<
    typeof notesTable.$inferSelect | null
  >(null);
  const editor = useCreateEditor({
    value: selectedNote ? (deserialize(selectedNote.content) as Value) : null,
  });

  const [animate] = useAutoAnimate();

  const filteredNotes = notes?.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content &&
        typeof note.content === "string" &&
        note.content.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleCreateNote = (): void => {
    createNote({
      title: "New Note",
      content: "",
    });
  };

  const handleSaveNote = (): void => {
    if (!selectedNote) return;

    updateNote({
      ...selectedNote,
      title: titleRef.current?.textContent || "New Note",
      content: content as Value,
    });
  };

  const handleDeleteNote = (noteId: number): void => {
    deleteNote(noteId);
    setNoteToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading notes...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col gap-6 overflow-y-auto">
      <div className="flex items-center justify-between px-6">
        <h1 className="text-3xl font-bold">Notes</h1>
        <Button onClick={handleCreateNote}>
          <Plus className="mr-2" />
          New Note
        </Button>
      </div>

      <div className="grid-cols-4 grid overflow-y-auto ">
        <div className="col-span-3 overflow-y-auto py-2 p-4 space-y-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 overflow-y-auto"
            ref={animate}
          >
            {filteredNotes?.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={() => setNoteToDelete(note.id)}
                onUpdate={updateNote}
                onClick={() => setSelectedNote(note)}
                isSelected={selectedNote?.id === note.id}
              />
            ))}
          </div>
        </div>

        <div
          className="absolute lg:w-1/3 xl:w-[21%] right-0 h-[calc(100vh-6.8rem)] col-span-1 rounded-l-xl border border-secondary-sidebar-border shadow-md pointer-events-auto shadow-md bg-secondary-sidebar p-6"
          ref={animate}
        >
          {selectedNote ? (
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <h2
                  ref={titleRef}
                  className="text-lg text-sidebar-primary-foreground font-semibold ring-0 outline-none"
                  contentEditable
                  dangerouslySetInnerHTML={{
                    __html: selectedNote.title,
                  }}
                />

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-secondary-sidebar-primary-foreground/10"
                    onClick={() => setSelectedNote(null)}
                  >
                    <DoorClosed
                      size={16}
                      strokeWidth={1.5}
                      className="stroke-secondary-sidebar-foreground"
                    />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto h-full">
                <BasicEditor
                  editor={editor}
                  setContent={(value) => {
                    setContent(value);
                  }}
                  editorClassName="text-sm text-secondary-sidebar-foreground"
                  placeholder="Start writing..."
                />
              </div>
              <Button
                variant="ghost"
                className="self-end hover:bg-secondary-sidebar-primary-foreground/10"
                size="icon"
                onClick={handleSaveNote}
              >
                <Save
                  size={16}
                  strokeWidth={1.5}
                  className="stroke-secondary-sidebar-foreground"
                />
              </Button>
            </div>
          ) : (
            <div className="pt-24 text-sm max-w-[300px] mx-auto text-center justify-center h-full text-muted-foreground">
              <h2 className="text-lg font-semibold text-sidebar-primary-foreground">
                No note selected
              </h2>
              <p className="text-sm">
                Open a note to start editing. You can also assign a note to a
                chapter.
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!noteToDelete} onOpenChange={() => setNoteToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              note.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => noteToDelete && handleDeleteNote(noteToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
