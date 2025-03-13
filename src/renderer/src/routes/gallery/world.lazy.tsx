import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/gallery/world")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  return <div>Hello Gallery World</div>;
}
