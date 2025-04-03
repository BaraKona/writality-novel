import { createFileRoute } from "@tanstack/react-router";
import { useBreadcrumbNav } from "@renderer/hooks/useBreadcrumbNav";
import { BreadcrumbNav } from "@renderer/components/navigation/BreadcrumbNav";
import { useCharacter } from "@renderer/hooks/character/useCharacter";

export const Route = createFileRoute("/people/characters/$characterId")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const { dropdownItems } = useBreadcrumbNav();
  const { characterId } = Route.useParams();

  const { data: character } = useCharacter(Number(characterId));

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
            <div className="w-[500px] border-l h-full bg-tertiary"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
