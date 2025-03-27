import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { CardContent } from "@renderer/components/ui/card";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@renderer/components/ui/dialogue";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { useCharacters } from "@renderer/hooks/character/useCharacters";
import { useCreateCharacter } from "@renderer/hooks/character/useCreateCharacter";
import { BasicEditor } from "@renderer/components/editor/BasicEditor";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import { Value } from "@udecode/plate";
import { serialize } from "@renderer/db";

interface CharacterNodeData {
  name: string;
  description: string;
  image: string;
  characterId?: number;
}

function CharacterNode({
  data,
  isConnectable,
  selected,
}: NodeProps<CharacterNodeData>): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterDescription, setNewCharacterDescription] = useState<Value>(
    [],
  );
  const [newCharacterSex, setNewCharacterSex] = useState("");
  const [newCharacterAge, setNewCharacterAge] = useState<number | null>(null);
  const [newCharacterTraits, setNewCharacterTraits] = useState<string[]>([]);

  const { data: characters } = useCharacters();
  const { mutate: createCharacter } = useCreateCharacter();
  const editor = useCreateEditor({ value: [] });

  const handleCreateCharacter = async (): Promise<void> => {
    if (!newCharacterName.trim()) return;

    createCharacter({
      name: newCharacterName,
      description: newCharacterDescription,
      sex: newCharacterSex,
      age: newCharacterAge || undefined,
      traits: newCharacterTraits,
    });

    setNewCharacterName("");
    setNewCharacterDescription([]);
    setNewCharacterSex("");
    setNewCharacterAge(null);
    setNewCharacterTraits([]);
    setIsCreateMode(false);
  };

  const handleCharacterSelect = (
    character: NonNullable<typeof characters>[number],
  ): void => {
    // Update node data with selected character
    data.name = character.name;
    // Convert the Plate editor value to a string for display
    data.description = serialize(character.description);
    data.characterId = character.id;
    setIsDialogOpen(false);
  };

  return (
    <div
      className={`p-1 w-full h-full flex flex-col overflow-y-auto !z-5 rounded-md ${selected ? "!bg-accent" : "!bg-transparent"}`}
    >
      <div
        className={`w-52 bg-background border rounded-lg hover:border-primary/20 group transition-colors cursor-pointer ${selected ? "border-primary/20" : ""}`}
        onClick={() => setIsDialogOpen(true)}
      >
        <CardContent className="p-3 text-center">
          <h3 className="font-bold text-sm truncate">{data.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-3 mt-1">
            {data.description || "No description"}
          </p>
        </CardContent>

        <Handle
          type="source"
          position={Position.Right}
          id="right"
          isConnectable={isConnectable}
          className="w-3 h-3 bg-primary group-hover:visible invisible"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          isConnectable={isConnectable}
          className="w-3 h-3 bg-primary group-hover:visible invisible"
        />
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          isConnectable={isConnectable}
          className="w-3 h-3 bg-primary group-hover:visible invisible"
        />
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          isConnectable={isConnectable}
          className="w-3 h-3 bg-primary group-hover:visible invisible"
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isCreateMode ? "Create New Character" : "Select Character"}
            </DialogTitle>
          </DialogHeader>

          {isCreateMode ? (
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
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateMode(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateCharacter}>Create</Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {characters?.map((character) => (
                  <Button
                    key={character.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleCharacterSelect(character)}
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={""} />
                      <AvatarFallback>
                        {character.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {character.name}
                  </Button>
                ))}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsCreateMode(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Character
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default memo(CharacterNode);
