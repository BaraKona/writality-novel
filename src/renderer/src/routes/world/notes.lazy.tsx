import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/world/notes")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/world/notes/lazt"!</div>;
}
