import { createLazyFileRoute } from "@tanstack/react-router";
import { BreadcrumbNav } from "@renderer/components/navigation/BreadcrumbNav";
import { CharacterGraph } from "@renderer/components/visualization/CharacterGraph";

import { Open, type TOpen } from "../__root";

import { useCallback } from "react";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
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
  const [selectedCharacterId, setSelectedCharacterId] = useAtom(
    selectedCharacterIdAtom,
  );

  const { data, isLoading } =
    useCharactersWithFractalRelationships(selectedFractalId);

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
          href: `/people/${character.character.id}`,
        }))}
        actions={<div className="flex items-center gap-2"></div>}
      />
      <div className="h-full flex-1 flex overflow-y-auto gap-2 p-2">
        <div className="h-full flex-1 flex-col flex overflow-y-auto">
          <div className="rounded-xl border rounded-t-lg h-full overflow-hidden">
            <table className="w-full overflow-y-auto">
              <thead className="overflow-y-auto">
                <tr className="border-b bg-tertiary text-sm">
                  <th className="text-left p-2 font-medium">Name</th>
                  <th className="text-left p-2 font-medium">Age</th>
                  <th className="text-left p-2 font-medium">Sex</th>
                  <th className="text-left p-2 font-medium">Faction</th>
                  <th className="text-left p-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="my-12">
                {data?.map((character) => (
                  <tr
                    key={character.character.id}
                    className="hover:bg-muted/50 text-sm"
                    onClick={() => {
                      navigate({
                        to: "/people/$characterId",
                        params: {
                          characterId: character.character.id.toString(),
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
                    <td className="p-2">
                      <Badge variant="outline">
                        {character.character.faction || "Unknown"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">
                        {character.character.status || "Unknown"}
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
