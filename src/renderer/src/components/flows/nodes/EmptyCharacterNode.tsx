import { CardContent } from "@renderer/components/ui/card";
import { Card, CardHeader } from "@renderer/components/ui/card";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { DropdownMenu } from "@renderer/components/ui/dropdown-menu";
import { List, Plus, User } from "lucide-react";
import { charactersTable } from "../../../../../db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useCharacters } from "@renderer/hooks/character/useCharacters";

export default function EmptyCharacterNode({
  handleNewCharacter,
  handleCharacterSelect,
  data,
  usedCharacterIds,
}: {
  handleNewCharacter: () => void;
  handleCharacterSelect: (
    character: InferSelectModel<typeof charactersTable>,
  ) => void;
  data: {
    characterId: number;
  };
  usedCharacterIds: number[];
}): JSX.Element {
  const { data: characters } = useCharacters();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="nodrag cursor-default">
        <Card className="w-64 shadow-md border-2 hover:border-muted-foreground transition-colors bg-muted/30 border-dashed">
          <CardHeader className="p-3 pb-0">
            <div className="flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="text-center">
              <h3 className="font-bold text-sm truncate">Character</h3>
              <p className="text-xs text-muted-foreground line-clamp-4 mt-1">
                Click to add character
              </p>
            </div>
          </CardContent>
        </Card>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleNewCharacter}>
          <Plus className="h-4 w-4 mr-2" />
          New Character
        </DropdownMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DropdownMenuItem>
              <List className="h-4 w-4 mr-2" />
              Select Character
            </DropdownMenuItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-48">
            {characters
              ?.filter(
                (character) =>
                  !usedCharacterIds?.includes(character.id) &&
                  character.id !== data.characterId,
              )
              .map((character) => (
                <DropdownMenuItem
                  key={`character-${character.id}`}
                  onClick={() => handleCharacterSelect(character)}
                >
                  {character.name}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
