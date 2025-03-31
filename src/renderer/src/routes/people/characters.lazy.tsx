import { createLazyFileRoute } from "@tanstack/react-router";
import { useCharacters } from "@renderer/hooks/character/useCharacters";
import { useCreateCharacter } from "@renderer/hooks/character/useCreateCharacter";
import { Button } from "@renderer/components/ui/button";
import { BasicEditor } from "@renderer/components/editor/BasicEditor";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import { useState } from "react";
import { Value } from "@udecode/plate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialogue";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { CharacterCard } from "@renderer/components/character/CharacterCard";
import { PlusIcon } from "lucide-react";
import { BreadcrumbNav } from "@renderer/components/navigation/BreadcrumbNav";
import { useBreadcrumbNav } from "@renderer/hooks/useBreadcrumbNav";
import { currentProjectIdAtom } from "@renderer/routes/__root";
import { useAtomValue } from "jotai";

export const Route = createLazyFileRoute("/people/characters")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const { data: characters, isLoading } = useCharacters();
  const { mutate: createCharacter } = useCreateCharacter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterDescription, setNewCharacterDescription] = useState<Value>(
    [],
  );
  const [newCharacterSex, setNewCharacterSex] = useState("");
  const [newCharacterAge, setNewCharacterAge] = useState<number | null>(null);
  const [newCharacterOccupation, setNewCharacterOccupation] = useState("");
  const [newCharacterTraits, setNewCharacterTraits] = useState<string[]>([]);
  const { items, dropdownItems } = useBreadcrumbNav();
  const editor = useCreateEditor({ value: [] });
  const currentProjectId = useAtomValue(currentProjectIdAtom);

  const handleCreateCharacter = async (): Promise<void> => {
    if (!newCharacterName.trim()) return;

    createCharacter({
      project_id: currentProjectId!,
      name: newCharacterName,
      description: newCharacterDescription,
      sex: newCharacterSex,
      age: newCharacterAge || undefined,
      occupation: newCharacterOccupation,
      traits: newCharacterTraits,
    });

    setNewCharacterName("");
    setNewCharacterDescription([]);
    setNewCharacterSex("");
    setNewCharacterAge(null);
    setNewCharacterOccupation("");
    setNewCharacterTraits([]);
    setIsCreateDialogOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <BreadcrumbNav
        items={items}
        dropdownItems={dropdownItems}
        actions={
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 rounded-md p-1 px-2 text-xs font-medium"
              >
                <PlusIcon size={16} className="" strokeWidth={2.5} />
                New Character
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Character</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newCharacterName}
                    onChange={(e) => setNewCharacterName(e.target.value)}
                    placeholder="Enter character name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sex">Sex</Label>
                  <Input
                    id="sex"
                    value={newCharacterSex}
                    onChange={(e) => setNewCharacterSex(e.target.value)}
                    placeholder="Enter character sex"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={newCharacterAge || ""}
                    onChange={(e) =>
                      setNewCharacterAge(
                        e.target.value ? parseInt(e.target.value) : null,
                      )
                    }
                    placeholder="Enter character age"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <BasicEditor
                    editor={editor}
                    setContent={setNewCharacterDescription}
                    placeholder="Enter character description"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCharacter}>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 container p-2">
        {characters?.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
}
