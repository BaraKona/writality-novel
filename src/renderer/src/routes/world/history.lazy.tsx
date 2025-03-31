import { createLazyFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@renderer/components/ComingSoon";

export const Route = createLazyFileRoute("/world/history")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  return <ComingSoon />;
}
