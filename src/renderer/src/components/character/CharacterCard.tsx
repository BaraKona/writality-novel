import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { BasicEditor } from "../editor/BasicEditor";
import { charactersTable } from "@db/schema";
import { useDebounce } from "@renderer/hooks/useDebounce";
import { Value } from "@udecode/plate";
import { useUpdateCharacter } from "@renderer/hooks/character/useUpdateCharacter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CharacterCardRelationships } from "./CharacterCardRelationships";
import { Link } from "@tanstack/react-router";
import { Badge } from "../ui/badge";
import { cn } from "@renderer/lib/utils";
import { getFactionColor } from "@renderer/lib/utils";

interface CharacterCardProps {
  character: typeof charactersTable.$inferSelect & {
    description: Value;
    traits: string[];
    goals: string[];
    personality: string[];
  };
}

export function CharacterCard({ character }: CharacterCardProps): JSX.Element {
  const editor = useCreateEditor({ value: character.description });
  const { mutate: updateCharacter } = useUpdateCharacter();

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
    <div className="w-full h-full flex flex-col gap-2 p-2 border rounded-lg bg-card">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <User size={16} />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link
            to="/people/$characterId"
            params={{ characterId: character.id }}
            className="text-sm font-medium hover:underline"
          >
            {character.name}
          </Link>
          <div className="flex items-center gap-1">
            {character.faction && (
              <Badge
                variant="outline"
                className={cn(getFactionColor(character.faction))}
              >
                {character.faction}
              </Badge>
            )}
            {character.occupation && (
              <Badge variant="secondary" className="text-xs">
                {character.occupation}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="description" className="flex-1">
            Description
          </TabsTrigger>
          <TabsTrigger value="details" className="flex-1">
            Details
          </TabsTrigger>
          <TabsTrigger value="relationships" className="flex-1">
            Relationships
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-2">
          <BasicEditor
            editor={editor}
            setContent={debounceUpdateCharacter}
            editorClassName="min-h-[100px]"
          />
        </TabsContent>

        <TabsContent value="details" className="mt-2 space-y-4">
          {character.appearance && (
            <div>
              <h4 className="text-sm font-medium mb-1">Appearance</h4>
              <p className="text-sm text-muted-foreground">
                {character.appearance}
              </p>
            </div>
          )}

          {character.traits && character.traits.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Traits</h4>
              <div className="flex flex-wrap gap-1">
                {/* {character?.traits?.map((trait: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {trait}
                  </Badge>
                ))} */}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="relationships" className="mt-2">
          <CharacterCardRelationships character={character} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
