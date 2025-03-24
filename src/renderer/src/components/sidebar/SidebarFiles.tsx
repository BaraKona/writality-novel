import { FilePlus2, FolderPlus, Plus, Trash2, Waypoints } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@renderer/components/ui/sidebar";
import { useCreateFolder } from "@renderer/hooks/folder/useCreateFolder";
import { useCreateChapter } from "@renderer/hooks/chapter/useCreateChapter";
import { FolderListItem } from "./FolderListItem";
import { useLocalStorage } from "@renderer/hooks/useLocalStorage";
import { useProjectFiles } from "@renderer/hooks/project/useProjectFiles";
import { FileListItem } from "./FileListItem";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Button } from "../ui/button";
import { projectsTable } from "@db/schema";
import { Value } from "@udecode/plate";

export function SidebarFiles({
  project,
}: {
  project?:
    | (typeof projectsTable.$inferSelect & { description: Value })
    | undefined;
}): JSX.Element {
  const { data: projectFiles } = useProjectFiles(project?.id);
  const { mutate: createProjectFolder } = useCreateFolder(project?.id);
  const { mutate: createChapter } = useCreateChapter(project?.id, "project");

  const [animate] = useAutoAnimate();

  const [openFolders, setOpenFolders] = useLocalStorage<{
    [key: string]: boolean;
  }>("openFolders", {});

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center justify-between">
        Files
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Plus size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-48 rounded-lg"
            side={"right"}
            align="start"
          >
            <DropdownMenuItem onClick={createChapter}>
              <FilePlus2 className="text-muted-foreground" />
              <span>Create file</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => createProjectFolder(null)}>
              <FolderPlus className="text-muted-foreground" />
              <span>Create Folder</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => createProjectFolder(null)}>
              <Waypoints className="text-muted-foreground" />
              <span>Create Fractal</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Trash2 className="text-muted-foreground" />
              <span>Delete Project</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarGroupLabel>
      <SidebarMenu ref={animate}>
        {projectFiles?.chapters?.length === 0 &&
        projectFiles?.folders?.length === 0 ? (
          <div className="text-sidebar-foreground/70 border overflow-hidden hover:border-foreground/20 flex flex-col divide-y divide-border rounded-xl bg-primary-foreground">
            <div className="p-2 text-sm">
              <h2 className="font-medium">No files or folders?</h2>
              <div className="text-muted-foreground">
                Let&apos;s get started by creating a file or folder. You can
                always add more later using the buttons below.
              </div>
            </div>

            <Button
              className="w-full rounded-none"
              size="md"
              variant="ghost"
              onClick={createChapter}
            >
              Create a file
            </Button>

            <Button
              className="w-full rounded-none"
              size="md"
              variant="ghost"
              onClick={() => createProjectFolder(null)}
            >
              Create a folder
            </Button>
          </div>
        ) : (
          <>
            {projectFiles?.folders?.map((item) => (
              <FolderListItem
                key={item.id}
                folder={item}
                level={0}
                openFolders={openFolders}
                setOpenFolders={setOpenFolders}
              />
            ))}
            {projectFiles?.chapters?.map((chapter) => (
              <FileListItem key={chapter.id} chapter={chapter} level={0} />
            ))}
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
