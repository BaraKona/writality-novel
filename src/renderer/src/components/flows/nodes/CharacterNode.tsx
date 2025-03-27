import { memo } from "react";
import { Handle, Position, useReactFlow, type NodeProps } from "reactflow";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@renderer/components/ui/avatar";
import { User, List, Ellipsis } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { useCharacters } from "@renderer/hooks/character/useCharacters";
import { BasicEditor } from "@renderer/components/editor/BasicEditor";
import { useCreateEditor } from "@renderer/components/editor/use-create-editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { useDebounce } from "@renderer/hooks/useDebounce";
import { Value } from "@udecode/plate";
import { useUpdateCharacter } from "@renderer/hooks/character/useUpdateCharacter";
import { useCharacter } from "@renderer/hooks/character/useCharacter";
import EmptyCharacterNode from "./EmptyCharacterNode";
import { charactersTable } from "@db/schema";
import { InferSelectModel } from "drizzle-orm";

interface CharacterNodeData {
  name: string;
  description: string;
  image: string;
  characterId?: number;
}

function CharacterNode({
  data,
  isConnectable,
  id,
}: NodeProps<CharacterNodeData>): JSX.Element {
  const { data: characters } = useCharacters();
  const { data: character } = useCharacter(data.characterId as number);
  const editor = useCreateEditor({ value: character?.description as Value });
  const { setNodes, getNodes } = useReactFlow();
  const { mutate: updateCharacter } = useUpdateCharacter();

  const handleCharacterUpdate = (content: Value): void => {
    updateCharacter({
      ...character,
      description: content,
    });
  };

  const handleCharacterSelect = (
    character: InferSelectModel<typeof charactersTable>,
  ): void => {
    console.log({ character });
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { characterId: character.id } }
          : node,
      ),
    );
  };

  const debounceUpdateCharacter = useDebounce((content: Value) => {
    handleCharacterUpdate(content);
  }, 500);

  // Get all character IDs currently in use in the fractal
  const usedCharacterIds = getNodes()
    .filter((node) => node.type === "characterNode")
    .map((node) => (node.data as CharacterNodeData).characterId)
    .filter((id): id is number => id !== undefined);

  if (!character) {
    return (
      <EmptyCharacterNode
        handleNewCharacter={() => {}}
        handleCharacterSelect={handleCharacterSelect}
        data={{ characterId: data.characterId as number }}
        usedCharacterIds={usedCharacterIds}
      />
    );
  }

  return (
    <div className="w-64 bg-card max-h-96 overflow-y-auto cursor-grab rounded-xl flex flex-col gap-2 border-2 hover:border-foreground/25 transition-colors cursor-pointer">
      <div className="w-full border-b flex items-center px-2 cursor-grab">
        <Avatar className="h-8 w-8 absolute top-4 left-2">
          <AvatarImage src={data.image} />
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
              <DropdownMenuTrigger asChild>
                <DropdownMenuItem>
                  <List className="h-4 w-4 mr-2" />
                  Change Character
                </DropdownMenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                className="w-48 max-h-64 overflow-y-auto"
              >
                {characters
                  ?.filter((char) => !usedCharacterIds?.includes(char.id))
                  .map((character) => (
                    <DropdownMenuItem
                      key={character.id}
                      className="items-start"
                      onClick={() => handleCharacterSelect(character)}
                    >
                      <User size={15} className="pt-1" />
                      {character.name}
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
      {isConnectable && (
        <>
          <Handle
            type="target"
            position={Position.Top}
            className="!bg-brand"
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="!bg-brand"
            isConnectable={isConnectable}
          />
        </>
      )}
    </div>
  );
}

export default memo(CharacterNode);
