import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useBreadcrumbNav } from "@renderer/hooks/useBreadcrumbNav";
import { BreadcrumbNav } from "@renderer/components/navigation/BreadcrumbNav";
import { useCharacterWithRelationships } from "@renderer/hooks/character/useCharacterWithRelationships";
import { CharacterRelationshipsGraph } from "@renderer/components/visualization/CharacterRelationshipsGraph";
import { Ellipsis, Loader2, X } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import { BasicEditor } from "@renderer/components/editor/BasicEditor";
import { useUpdateCharacter } from "@renderer/hooks/character/useUpdateCharacter";
import { useDebounce } from "@renderer/hooks/useDebounce";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";
import { Value } from "@udecode/plate";
import { charactersTable } from "@db/schema";
import { useFractals } from "@renderer/hooks/fractal/useFractals";
import { useState } from "react";

type CharacterUpdate = Omit<
  typeof charactersTable.$inferSelect,
  "description"
> & {
  description: Value;
};

export const Route = createFileRoute("/people/characters/$characterId")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const { dropdownItems } = useBreadcrumbNav();
  const { characterId } = Route.useParams();
  const navigate = useNavigate();
  const { data: fractals } = useFractals();
  const [selectedFractalId, setSelectedFractalId] = useState<number | null>(
    fractals && fractals.length > 0 ? fractals[0].id : null,
  );

  const { data: character, isLoading } = useCharacterWithRelationships(
    Number(characterId),
    selectedFractalId,
  );

  const editor = useCreateEditor({
    value: character?.description,
  });

  const { mutate: updateCharacter } = useUpdateCharacter();

  const handleCharacterUpdate = (content: Partial<CharacterUpdate>): void => {
    if (!character) return;
    updateCharacter({
      ...character,
      ...content,
    });
  };

  const debounceUpdateCharacter = useDebounce(
    (content: Partial<CharacterUpdate>) => {
      handleCharacterUpdate(content);
    },
    500,
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  if (!character) {
    return <div>Character not found</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <BreadcrumbNav
        items={[
          {
            title: "People",
            href: "/people",
          },
          {
            title: "Characters",
            href: "/people/characters",
          },
          {
            title: character?.name ?? "New Character",
            href: `/people/characters/${characterId}`,
            isCurrentPage: true,
          },
        ]}
        dropdownItems={dropdownItems}
      />
      <section className="flex p-2 w-full flex-1 overflow-hidden">
        <div className="border rounded-lg w-full h-full shadow-xs flex flex-col">
          <div className="flex gap-2 border-b py-2 px-3">
            <h1 className="text-2xl font-bold">{character?.name}</h1>
            <div className="flex gap-2 ml-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  navigate({
                    to: "/people/characters",
                  })
                }
              >
                <X size={16} />
              </Button>
            </div>
          </div>
          <div className="flex gap-2 grow overflow-y-auto">
            <div className="w-full h-full flex flex-col p-4 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    defaultValue={character.age || ""}
                    onChange={(e) =>
                      debounceUpdateCharacter({
                        age: parseInt(e.target.value) || null,
                      })
                    }
                    placeholder="Age"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sex">Sex</Label>
                  <Select
                    defaultValue={character.sex || ""}
                    onValueChange={(value) =>
                      debounceUpdateCharacter({ sex: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="traits">Traits</Label>
                  <Input
                    id="traits"
                    defaultValue={
                      character.traits
                        ? JSON.parse(character?.traits).join(", ")
                        : ""
                    }
                    onChange={(e) =>
                      debounceUpdateCharacter({
                        traits: JSON.stringify(
                          e.target.value.split(",").map((t) => t.trim()),
                        ),
                      })
                    }
                    placeholder="Traits (comma separated)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    defaultValue={character.status || "alive"}
                    onValueChange={(value) =>
                      debounceUpdateCharacter({ status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alive">Alive</SelectItem>
                      <SelectItem value="dead">Dead</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <div className="border rounded-lg p-2">
                  <BasicEditor
                    editor={editor}
                    setContent={(content) =>
                      debounceUpdateCharacter({ description: content })
                    }
                    editorClassName="min-h-[200px]"
                    placeholder="Write a description of your character..."
                  />
                </div>
              </div>
            </div>
            <div className="max-w-md w-full border-l h-full bg-tertiary flex flex-col">
              <div className="flex gap-2 items-center border-b py-2 px-3 border-b bg-background justify-between">
                <h2 className="text-md font-bold">Relationships</h2>
                <Button variant="ghost" size="icon">
                  <Ellipsis className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-[400px] p-3">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  <CharacterRelationshipsGraph
                    characterId={character.id}
                    characterName={character.name}
                    relationships={character.relationships}
                    fractals={fractals}
                    selectedFractalId={selectedFractalId}
                    onFractalChange={setSelectedFractalId}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
