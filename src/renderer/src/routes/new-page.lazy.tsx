import { Separator } from "@renderer/components/ui/separator";
import { BookPlusIcon, FileTextIcon, FolderIcon } from "lucide-react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { AppIcon } from "@renderer/assets/AppIcon";
import { Button } from "@renderer/components/ui/button";
import { useAtomValue } from "jotai";
import { currentProjectIdAtom } from "./__root";
import { useCreateChapter } from "@renderer/hooks/chapter/useCreateChapter";

export const Route = createLazyFileRoute("/new-page")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const currentProjectId = useAtomValue(currentProjectIdAtom);
  const { mutate: createChapter } = useCreateChapter(
    currentProjectId as number,
    "project",
    true,
  );
  return (
    <section className="grid place-items-center w-full h-full flex-col">
      <div className="-mt-24">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="w-80 h-80 opacity-50 col-span-1">
            <AppIcon />
          </div>
          <div className="flex flex-col gap-2 col-span-1 justify-center">
            <h1 className="text-2xl font-semibold">New Page</h1>
            <p className="text-sm mb-2">
              Navigate to any page or create a new one.
            </p>
            <div className="flex flex-col gap-0.5">
              <Button
                variant="ghost"
                className="flex gap-2 justify-start text-sm py-1 px-2 rounded-md cursor-default"
                onClick={createChapter}
              >
                <FileTextIcon
                  strokeWidth={1.5}
                  size={16}
                  className="shrink-0"
                />
                Create new file
              </Button>
              <Button
                variant="ghost"
                className="flex gap-2 justify-start text-sm py-1 px-2 rounded-md cursor-default"
              >
                <FolderIcon strokeWidth={1.5} size={16} className="shrink-0" />
                Create new folder
              </Button>
            </div>
            <Separator className="w-full" />
            <Button
              variant="ghost"
              className="flex gap-2 justify-start text-sm py-1 px-2 rounded-md cursor-default"
            >
              <BookPlusIcon strokeWidth={1.5} size={16} className="shrink-0" />
              New new project
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
