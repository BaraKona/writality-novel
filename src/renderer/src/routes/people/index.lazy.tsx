import { createLazyFileRoute } from "@tanstack/react-router";
import { BreadcrumbNav } from "@renderer/components/navigation/BreadcrumbNav";
import { CharacterGraph } from "@renderer/components/visualization/CharacterGraph";

import { Open, type TOpen } from "../__root";

import { useCallback } from "react";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { Button } from "@renderer/components/ui/button";
import { ChevronsLeft, ChevronsRight, Menu } from "lucide-react";
import { useFractals } from "@renderer/hooks/fractal/useFractals";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";
import { useCharactersWithFractalRelationships } from "@renderer/hooks/character/useCharacters";
import { Badge } from "@renderer/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
export const Route = createLazyFileRoute("/people/")({
  component: RouteComponent,
});

const peopleSidebarStateAtom = atomWithStorage<TOpen>(
  "peopleSidebarState",
  Open.Open,
);

const selectedFractalIdAtom = atomWithStorage<number | null>(
  "selectedFractalId",
  null,
);

const selectedCharacterIdAtom = atomWithStorage<number | null>(
  "selectedCharacterId",
  null,
);

function RouteComponent(): JSX.Element {
  const [selectedFractalId, setSelectedFractalId] = useAtom(
    selectedFractalIdAtom,
  );
  const [sidebarState, setSidebarState] = useAtom(peopleSidebarStateAtom);
  const [selectedCharacterId, setSelectedCharacterId] = useAtom(
    selectedCharacterIdAtom,
  );

  const { data, isLoading } =
    useCharactersWithFractalRelationships(selectedFractalId);

  const { data: fractals } = useFractals();
  const navigate = useNavigate();

  const onCharacterSelect = useCallback(
    (characterId: number): void => {
      setSelectedCharacterId(characterId);
    },
    [setSelectedCharacterId],
  );

  return (
    <div className="w-full grow overflow-y-auto relative flex flex-col">
      <BreadcrumbNav
        items={[
          {
            title: "People",
            isCurrentPage: true,
          },
        ]}
        dropdownItems={data?.map((character) => ({
          title: character.character.name,
          href: `/people/characters/${character.character.id}`,
        }))}
        actions={
          <div className="flex items-center gap-2">
            <Select
              value={selectedFractalId?.toString()}
              onValueChange={(value) => setSelectedFractalId(Number(value))}
            >
              <SelectTrigger className="hover:bg-accent gap-2 border-none shadow-none h-5.5 text-sm">
                <SelectValue placeholder="Select a fractal" />
              </SelectTrigger>
              <SelectContent>
                {fractals?.length === 0 ? (
                  <div className="py-2 text-sm text-muted-foreground text-center">
                    No fractals available
                  </div>
                ) : (
                  fractals?.map((fractal) => (
                    <SelectItem
                      key={fractal.id}
                      value={fractal.id.toString()}
                      onSelect={() => setSelectedFractalId(fractal.id)}
                    >
                      {fractal.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button
              variant="invisible"
              size="icon"
              className="flex group items-center gap-2 rounded-md p-1 px-2 text-xs font-medium"
              onClick={() => {
                setSidebarState((state) =>
                  state === Open.Open ? Open.Closed : Open.Open,
                );
                setSelectedCharacterId(null);
              }}
            >
              {sidebarState === Open.Open ? (
                <>
                  <Menu
                    size={16}
                    strokeWidth={1.5}
                    className="text-foreground block group-hover:hidden"
                  />
                  <ChevronsRight
                    size={16}
                    strokeWidth={1.5}
                    className="text-foreground hidden group-hover:block"
                  />
                </>
              ) : (
                <>
                  <Menu
                    size={16}
                    strokeWidth={1.5}
                    className="text-foreground block group-hover:hidden"
                  />
                  <ChevronsLeft
                    size={16}
                    strokeWidth={1.5}
                    className="text-foreground hidden group-hover:block"
                  />
                </>
              )}
            </Button>
          </div>
        }
      />
      <div className="h-full flex-1 flex overflow-y-auto gap-2 p-2">
        <div className="h-full flex-1 flex-col flex overflow-y-auto">
          <div className="rounded-xl border rounded-t-lg h-full">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-tertiary text-sm">
                  <th className="text-left p-2 font-medium">Name</th>
                  <th className="text-left p-2 font-medium">Age</th>
                  <th className="text-left p-2 font-medium">Sex</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((character) => (
                  <tr
                    key={character.character.id}
                    className="border-b hover:bg-muted/50"
                    onClick={() => {
                      navigate({
                        to: "/people/characters/$characterId",
                        params: {
                          characterId: character.character.id,
                        },
                      });
                    }}
                  >
                    <td className="p-2">{character.character.name}</td>
                    <td className="p-2">
                      <Badge variant="outline">
                        {character.character.age || "Unknown"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">
                        {character.character.sex || "Unknown"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-[500px] h-full">
          <CharacterGraph
            data={data}
            isLoading={isLoading}
            selectedFractalId={selectedFractalId}
            onCharacterSelect={onCharacterSelect}
          />
        </div>
      </div>
    </div>
  );
}
