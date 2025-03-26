import { createLazyFileRoute } from "@tanstack/react-router";
import { BreadcrumbNav } from "@renderer/components/navigation/BreadcrumbNav";

export const Route = createLazyFileRoute("/people/")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  return (
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
  );
}
