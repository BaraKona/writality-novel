import { createFileRoute } from "@tanstack/react-router";
import { useBreadcrumbNav } from "@renderer/hooks/useBreadcrumbNav";
import { BreadcrumbNav } from "@renderer/components/navigation/BreadcrumbNav";
import { useCharacterWithRelationships } from "@renderer/hooks/character/useCharacterWithRelationships";
import { CharacterRelationshipsGraph } from "@renderer/components/visualization/CharacterRelationshipsGraph";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/people/characters/$characterId")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const { dropdownItems } = useBreadcrumbNav();
  const { characterId } = Route.useParams();

  const { data: character, isLoading } = useCharacterWithRelationships(
    Number(characterId),
  );

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
          <div className="flex flex-col gap-2 border-b py-2 px-4">
            <h1 className="text-2xl font-bold">{character?.name}</h1>
          </div>
          <div className="flex gap-2 grow overflow-y-auto">
            <div className="w-full h-full flex"></div>
            <div className="w-[600px] border-l h-full bg-tertiary flex flex-col">
              <div className="flex flex-col gap-2 border-b py-2 px-4">
                <h2 className="text-lg font-bold">Relationships</h2>
              </div>
              <div className="h-[400px]">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  <CharacterRelationshipsGraph
                    characterId={character.id}
                    characterName={character.name}
                    relationships={character.relationships}
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
