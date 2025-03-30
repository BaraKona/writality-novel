import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import { Button } from "@renderer/components/ui/button";
import { Ellipsis, SquareArrowRight, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BasicEditor } from "../editor/BasicEditor";
import { charactersTable } from "@db/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDebounce } from "@renderer/hooks/useDebounce";
import { Value } from "@udecode/plate";
import { useCreateCharacter } from "@renderer/hooks/character/useCreateCharacter";
import { useUpdateCharacter } from "@renderer/hooks/character/useUpdateCharacter";

interface CharacterCardProps {
  character: typeof charactersTable.$inferSelect;
}

export function CharacterCard({ character }: CharacterCardProps): JSX.Element {
  const editor = useCreateEditor({
    value: character?.description,
  });

  const { mutate: updateCharacter } = useUpdateCharacter();
  const { mutate: createCharacter } = useCreateCharacter();

  const handleCharacterUpdate = (content: Value): void => {
    updateCharacter({
      ...character,
      description: content,
    });
  };

  const debounceUpdateCharacter = useDebounce((content: Value) => {
    handleCharacterUpdate(content);
  }, 500);

  if (!character) {
    return <div>Character not found</div>;
  }

  return (
    <div className="relative bg-card max-h-96 overflow-y-auto cursor-grab rounded-xl flex flex-col gap-2 border hover:border-foreground/25 transition-colors cursor-pointer">
      <div className="w-full border-b flex items-center px-2 cursor-grab">
        <Avatar className="h-8 w-8 absolute top-4 left-2">
          <AvatarImage src={character?.image} />
          <AvatarFallback>
            <User size={16} />
          </AvatarFallback>
        </Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="ml-auto">
            <Button variant="ghost" size="icon">
              <Ellipsis size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenu>
              <DropdownMenuItem>
                <SquareArrowRight className="h-4 w-4 mr-2" />
                Open Character
              </DropdownMenuItem>
            </DropdownMenu>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className="flex flex-col gap-2 pb-2 nodrag rounded-xl cursor-default px-2 cursor-default overflow-y-auto nowheel"
        id="editor-wrapper"
      >
        <div className="w-full flex mt-4 items-center gap-2 justify-between">
          <span className="text-xs">
            {character.age || "unknown"} years old
          </span>
          {character.age && (
            <div className="text-xs text-foreground border rounded-sm bg-muted px-2 text-primary py-0.25 ">
              {character.sex}
            </div>
          )}
        </div>
        <h2
          contentEditable={true}
          className="ring-0 outline-none text-md font-semibold text-foreground/80 pr-4 w-full"
          dangerouslySetInnerHTML={{ __html: character.name }}
          onBlur={(e) => {
            updateCharacter({
              ...character,
              name: e.target.innerHTML,
            });
          }}
        />
        <BasicEditor
          editor={editor}
          setContent={(content) => debounceUpdateCharacter(content)}
          editorClassName="text-sm text-foreground min-h-[100px] p-0"
          placeholder="Start writing..."
        />
      </div>
    </div>
  );
}
