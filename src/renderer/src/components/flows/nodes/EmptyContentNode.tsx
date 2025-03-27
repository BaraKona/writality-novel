import { CardContent } from "@renderer/components/ui/card";
import { Card, CardHeader } from "@renderer/components/ui/card";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { useProjectNotes } from "@renderer/hooks/useProjectNotes";
import { DropdownMenu } from "@renderer/components/ui/dropdown-menu";
import { FileText, List, Plus } from "lucide-react";
import { notesTable } from "../../../../../db/schema";
import { InferSelectModel } from "drizzle-orm";

export default function EmptyContentNode({
  handleNewNote,
  handleSelectNote,
  currentProjectId,
  data,
  usedNoteIds,
}: {
  handleNewNote: () => void;
  handleSelectNote: (note: InferSelectModel<typeof notesTable>) => void;
  currentProjectId: number;
  data: {
    noteId: number;
  };
  usedNoteIds: number[];
}): JSX.Element {
  const { data: notes } = useProjectNotes(currentProjectId as number);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="nodrag cursor-default">
        <Card className="w-64 shadow-md border-2 hover:border-muted-foreground transition-colors bg-muted/30 border-dashed">
          <CardHeader className="p-3 pb-0">
            <div className="flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="text-center">
              <h3 className="font-bold text-sm truncate">Content</h3>
              <p className="text-xs text-muted-foreground line-clamp-4 mt-1">
                Click to add content
              </p>
            </div>
          </CardContent>
        </Card>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleNewNote}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </DropdownMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DropdownMenuItem>
              <List className="h-4 w-4 mr-2" />
              Select Note
            </DropdownMenuItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-48">
            {notes
              ?.filter(
                (note) =>
                  !usedNoteIds.includes(note.id) && note.id !== data.noteId,
              )
              .map((note) => (
                <DropdownMenuItem
                  key={note.id}
                  onClick={() => handleSelectNote(note)}
                >
                  {note.title}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
