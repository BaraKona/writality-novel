import { createLazyFileRoute } from "@tanstack/react-router";
import { BreadcrumbNav } from "@renderer/components/navigation/BreadcrumbNav";
import { useCharactersWithFractalRelationships } from "@renderer/hooks/character/useCharacters";
import { CharacterGraph } from "@renderer/components/visualization/CharacterGraph";

export const Route = createLazyFileRoute("/people/")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const { data: characters, isLoading } =
    useCharactersWithFractalRelationships(11);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <BreadcrumbNav
        items={[
          {
            title: "People",
            isCurrentPage: true,
          },
        ]}
        dropdownItems={[
          {
            title: "Characters",
            href: "/people/characters",
          },
        ]}
      />
      <div className="h-[600px] w-full">
        {characters && <CharacterGraph data={characters} />}
      </div>
    </div>
  );
}
