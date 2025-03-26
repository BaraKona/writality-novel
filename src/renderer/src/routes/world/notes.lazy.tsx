import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useProjectNotes } from "@renderer/hooks/useProjectNotes";
import { currentProjectIdAtom } from "@renderer/routes/__root";
import { useAtomValue, useAtom } from "jotai";
import { Input } from "@renderer/components/ui/input";
import { Button } from "@renderer/components/ui/button";
import { Search, DoorClosed, Save, PlusIcon } from "lucide-react";
import { useCreateNote } from "@renderer/hooks/note/useCreateNote";
import { useDeleteNote } from "@renderer/hooks/note/useDeleteNote";
import { useState, useRef } from "react";
import { useUpdateNote } from "@renderer/hooks/note/useUpdateNote";
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
import { atomWithStorage } from "jotai/utils";
import { Open, TOpen } from "@renderer/routes/__root";
import clsx from "clsx";
import { SidebarExtender } from "@renderer/components/sidebar/SidebarExtender";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@renderer/components/ui/breadcrumb";

import "reactflow/dist/style.css";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export type NotesSidebarState = {
  state: TOpen;
  selectedNoteId: number | null;
  width: number;
};

const notesSidebarStateAtom = atomWithStorage<NotesSidebarState>(
  "NotesSidebarState",
  {
    state: Open.Closed,
    selectedNoteId: null,
    width: 400,
  },
);

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
  const [sidebarState, setSidebarState] = useAtom(notesSidebarStateAtom);
  const [isDragging, setDragging] = useState(false);
  const originalWidth = useRef(sidebarState.width);
  const originalClientX = useRef(sidebarState.width);
  const selectedNote =
    notes?.find((note) => note.id === sidebarState.selectedNoteId) || null;
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
    if (sidebarState.selectedNoteId === noteId) {
      setSidebarState({
        ...sidebarState,
        state: Open.Closed,
        selectedNoteId: null,
      });
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-y-auto">
      <div className="flex w-full gap-2 border-y p-2 py-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to="/world"
                  className="text-xs font-medium px-2 p-1 hover:bg-accent rounded-md"
                >
                  World
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-medium px-2 p-1 bg-accent rounded-md">
                Notes
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto flex items-center gap-2 rounded-md p-1 px-2 text-xs font-medium"
          onClick={handleCreateNote}
        >
          <PlusIcon size={16} className="" strokeWidth={2.5} />
          New Note
        </Button>
      </div>

      <div className="flex grow overflow-y-auto relative">
        <div
          className={clsx(
            "fixed top-0 bottom-0 z-[100] flex h-full pt-11.25 pb-4 pointer-events-none bg-transparent max-h-screen flex-shrink-0 flex-col space-y-2 transition-transform duration-300 ease-sidebar",
            {
              ["cursor-col-resize"]: isDragging,
            },
            isDragging
              ? "shadow-[rgba(0,0,0,0.2)_-2px_0px_0px_0px_inset]"
              : "shadow-[rgba(0,0,0,0.04)_-2px_0px_0px_0px_inset]",
            sidebarState.state === Open.Open
              ? "-translate-x-0 right-0"
              : "translate-x-full right-0",
          )}
          style={{ width: sidebarState.width }}
        >
          <SidebarExtender
            width={sidebarState.width}
            setWidth={(width) => setSidebarState({ ...sidebarState, width })}
            originalWidth={originalWidth}
            originalClientX={originalClientX}
            setDragging={setDragging}
            setState={(state) => setSidebarState({ ...sidebarState, state })}
            dragPosition="left"
            className="h-[91%] mt-10"
          />
          <aside
            className="h-full mt-10 rounded-l-xl border border-secondary-sidebar-border shadow-md pointer-events-auto shadow-md bg-secondary-sidebar p-6 overflow-y-auto"
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
                      onClick={() =>
                        setSidebarState({
                          ...sidebarState,
                          state: Open.Closed,
                          selectedNoteId: null,
                        })
                      }
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
          </aside>
        </div>

        <div
          key="file-content"
          style={{
            paddingRight:
              sidebarState.state === Open.Open ? sidebarState.width - 8 : 0,
          }}
          className={clsx(
            "flex max-h-screen w-full flex-grow flex-col",
            isDragging
              ? "transition-none"
              : "transition-all duration-300 ease-sidebar",
          )}
        >
          <div className="overflow-y-auto py-2 p-4 space-y-4 py-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isLoading ? (
              <div className="flex h-screen items-center justify-center">
                <div className="animate-pulse text-muted-foreground">
                  Loading notes...
                </div>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-2 overflow-y-auto grid-auto-rows-max"
                ref={animate}
              >
                {filteredNotes?.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={() => setNoteToDelete(note.id)}
                    onUpdate={updateNote}
                    onClick={() =>
                      setSidebarState({
                        ...sidebarState,
                        state: Open.Open,
                        selectedNoteId: note.id,
                      })
                    }
                    isSelected={sidebarState.selectedNoteId === note.id}
                  />
                ))}
              </div>
            )}
          </div>
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
