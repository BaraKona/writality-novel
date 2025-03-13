import { createLazyFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index(): JSX.Element {
  return <Navigate to={`/overview`} />;
}
