import { RichTextEditorDemo } from "@renderer/components/tiptap/rich-text-editor";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/world/notes")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RichTextEditorDemo className="w-full rounded-xl" />;
}
