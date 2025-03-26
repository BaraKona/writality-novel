import { createLazyFileRoute } from "@tanstack/react-router";
import { BreadcrumbNav } from "@renderer/components/navigation/BreadcrumbNav";
import { useBreadcrumbNav } from "@renderer/hooks/useBreadcrumbNav";

export const Route = createLazyFileRoute("/gallery/people")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const { items, dropdownItems } = useBreadcrumbNav();

  return <BreadcrumbNav items={items} dropdownItems={dropdownItems} />;
}
