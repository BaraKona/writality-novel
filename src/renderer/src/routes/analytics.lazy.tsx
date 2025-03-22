import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/analytics")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  return <div>Hello "/analytics"!</div>;
}
