import { createLazyFileRoute } from "@tanstack/react-router";
import { BreadcrumbNav } from "@renderer/components/navigation/BreadcrumbNav";
import { useBreadcrumbNav } from "@renderer/hooks/useBreadcrumbNav";
import { ComingSoon } from "@renderer/components/ComingSoon";

export const Route = createLazyFileRoute("/gallery/")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const { items, dropdownItems } = useBreadcrumbNav();

  return (
    <div className="flex flex-col gap-2 h-full">
      <BreadcrumbNav items={items} dropdownItems={dropdownItems} />
      <ComingSoon />
    </div>
  );
}
