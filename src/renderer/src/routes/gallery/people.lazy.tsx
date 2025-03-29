import { createLazyFileRoute } from "@tanstack/react-router";
import { BreadcrumbNav } from "@renderer/components/navigation/BreadcrumbNav";
import { useBreadcrumbNav } from "@renderer/hooks/useBreadcrumbNav";

export const Route = createLazyFileRoute("/gallery/people")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const { items, dropdownItems } = useBreadcrumbNav();

  return (
    <div className="flex flex-col gap-2">
      <BreadcrumbNav items={items} dropdownItems={dropdownItems} />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">People</h1>
        </div>
      </div>
    </div>
  );
}
